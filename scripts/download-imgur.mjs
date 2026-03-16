import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUTPUT_DIR = join(ROOT, 'static', 'images', 'blog');
const MAPPING_FILE = join(__dirname, 'imgur-mapping.json');

const IMGUR_REGEX = /https?:\/\/i\.imgur\.com\/([a-zA-Z0-9]+?)([sbtmlh])?\.([a-zA-Z0-9]+)(?:\?[^\s)'"]*)?/g;

const CONCURRENCY = 5;

/**
 * Scan files for imgur URLs and return a deduplicated list of image info.
 */
function scanFiles() {
  const mdFiles = glob.sync('src/content/blog/*.md', { cwd: ROOT, absolute: true });
  const extraFiles = [
    join(ROOT, 'src/components/SearchBox/index.tsx'),
    join(ROOT, 'src/pages/privacy-policies.astro'),
    join(ROOT, 'src/config/index.json'),
  ];

  const allFiles = [...mdFiles, ...extraFiles.filter((f) => existsSync(f))];
  /** @type {Map<string, { id: string, ext: string, originalUrls: string[] }>} */
  const imageMap = new Map();

  for (const filePath of allFiles) {
    const content = readFileSync(filePath, 'utf-8');
    let match;
    IMGUR_REGEX.lastIndex = 0;
    while ((match = IMGUR_REGEX.exec(content)) !== null) {
      const [fullUrl, id, _suffix, ext] = match;
      const key = `${id}.${ext}`;
      if (!imageMap.has(key)) {
        imageMap.set(key, { id, ext, originalUrls: [] });
      }
      const entry = imageMap.get(key);
      if (!entry.originalUrls.includes(fullUrl)) {
        entry.originalUrls.push(fullUrl);
      }
    }
  }

  return imageMap;
}

/**
 * Download a single image from imgur.
 */
async function downloadImage(id, ext) {
  const url = `https://i.imgur.com/${id}.${ext}`;
  const destPath = join(OUTPUT_DIR, `${id}.${ext}`);

  if (existsSync(destPath)) {
    console.log(`  [SKIP] ${id}.${ext} already exists`);
    return { success: true, skipped: true };
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    writeFileSync(destPath, buffer);
    console.log(`  [OK]   ${id}.${ext} (${(buffer.length / 1024).toFixed(1)} KB)`);
    return { success: true, skipped: false };
  } catch (error) {
    console.error(`  [FAIL] ${id}.${ext}: ${error.message}`);
    return { success: false, skipped: false, error: error.message };
  }
}

/**
 * Run tasks with limited concurrency.
 */
async function runWithConcurrency(tasks, limit) {
  const results = [];
  const executing = new Set();

  for (const task of tasks) {
    const p = task().then((result) => {
      executing.delete(p);
      return result;
    });
    executing.add(p);
    results.push(p);

    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}

async function main() {
  console.log('=== Imgur Image Downloader ===\n');

  // Ensure output directory exists
  mkdirSync(OUTPUT_DIR, { recursive: true });

  // Scan for imgur URLs
  console.log('Scanning files for imgur URLs...');
  const imageMap = scanFiles();
  console.log(`Found ${imageMap.size} unique images\n`);

  if (imageMap.size === 0) {
    console.log('No imgur images found. Nothing to do.');
    process.exit(0);
  }

  // Download images with concurrency limit
  console.log(`Downloading images (concurrency: ${CONCURRENCY})...`);
  const entries = Array.from(imageMap.values());
  const tasks = entries.map(({ id, ext }) => () => downloadImage(id, ext));
  const results = await runWithConcurrency(tasks, CONCURRENCY);

  // Build mapping
  /** @type {Record<string, string>} */
  const mapping = {};
  entries.forEach(({ id, ext, originalUrls }, i) => {
    const localPath = `/images/blog/${id}.${ext}`;
    for (const originalUrl of originalUrls) {
      mapping[originalUrl] = localPath;
    }
  });

  // Write mapping file
  writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2), 'utf-8');
  console.log(`\nMapping written to ${MAPPING_FILE}`);

  // Summary
  const downloaded = results.filter((r) => r.success && !r.skipped).length;
  const skipped = results.filter((r) => r.success && r.skipped).length;
  const failed = results.filter((r) => !r.success).length;
  console.log(`\n=== Summary ===`);
  console.log(`  Downloaded: ${downloaded}`);
  console.log(`  Skipped:    ${skipped}`);
  console.log(`  Failed:     ${failed}`);
  console.log(`  Total:      ${imageMap.size}`);

  if (failed > 0) {
    console.error('\nSome downloads failed. Check the logs above.');
    process.exit(1);
  }

  process.exit(0);
}

main();

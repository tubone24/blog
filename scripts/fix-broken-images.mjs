import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const IMAGE_DIR = join(ROOT, 'static', 'images', 'blog');

// 41 broken images: the last char of the imgur ID was wrongly stripped as a "size suffix"
const FIX_LIST = [
  { originalUrl: 'https://i.imgur.com/HPOddbh.png', wrongId: 'HPOddb', correctId: 'HPOddbh', ext: 'png' },
  { originalUrl: 'https://i.imgur.com/0GJzrGl.png', wrongId: '0GJzrG', correctId: '0GJzrGl', ext: 'png' },
  { originalUrl: 'https://i.imgur.com/4LAaL3b.png', wrongId: '4LAaL3', correctId: '4LAaL3b', ext: 'png' },
  { originalUrl: 'https://i.imgur.com/6WFqOEs.png', wrongId: '6WFqOE', correctId: '6WFqOEs', ext: 'png' },
  { originalUrl: 'https://i.imgur.com/9iGRHft.png', wrongId: '9iGRHf', correctId: '9iGRHft', ext: 'png' },
  { originalUrl: 'https://i.imgur.com/aL1N9Yl.png', wrongId: 'aL1N9Y', correctId: 'aL1N9Yl', ext: 'png' },
  { originalUrl: 'https://i.imgur.com/dVJdYdh.png', wrongId: 'dVJdYd', correctId: 'dVJdYdh', ext: 'png' },
  { originalUrl: 'https://i.imgur.com/E5N4Gjl.png', wrongId: 'E5N4Gj', correctId: 'E5N4Gjl', ext: 'png' },
  { originalUrl: 'https://i.imgur.com/eA5ztKm.png', wrongId: 'eA5ztK', correctId: 'eA5ztKm', ext: 'png' },
  { originalUrl: 'https://i.imgur.com/f2gUFXs.png', wrongId: 'f2gUFX', correctId: 'f2gUFXs', ext: 'png' },
  { originalUrl: 'https://i.imgur.com/FnGbBym.png', wrongId: 'FnGbBy', correctId: 'FnGbBym', ext: 'png' },
  { originalUrl: 'https://i.imgur.com/gWqd2xb.jpg', wrongId: 'gWqd2x', correctId: 'gWqd2xb', ext: 'jpg' },
  { originalUrl: 'https://i.imgur.com/he9u9kb.png', wrongId: 'he9u9k', correctId: 'he9u9kb', ext: 'png' },
  { originalUrl: 'https://i.imgur.com/hFtHg2b.jpg', wrongId: 'hFtHg2', correctId: 'hFtHg2b', ext: 'jpg' },
  { originalUrl: 'https://i.imgur.com/HlYxXks.jpg', wrongId: 'HlYxXk', correctId: 'HlYxXks', ext: 'jpg' },
  { originalUrl: 'https://i.imgur.com/iLyWtZb.png', wrongId: 'iLyWtZ', correctId: 'iLyWtZb', ext: 'png' },
  { originalUrl: 'https://i.imgur.com/Ip4IaYs.png', wrongId: 'Ip4IaY', correctId: 'Ip4IaYs', ext: 'png' },
  { originalUrl: 'https://i.imgur.com/jgIda5b.png', wrongId: 'jgIda5', correctId: 'jgIda5b', ext: 'png' },
  { originalUrl: 'https://i.imgur.com/KFWmk6h.jpg', wrongId: 'KFWmk6', correctId: 'KFWmk6h', ext: 'jpg' },
  { originalUrl: 'https://i.imgur.com/KUqm5Qs.png', wrongId: 'KUqm5Q', correctId: 'KUqm5Qs', ext: 'png' },
  { originalUrl: 'https://i.imgur.com/LaMP20t.png', wrongId: 'LaMP20', correctId: 'LaMP20t', ext: 'png' },
  { originalUrl: 'https://i.imgur.com/msMkGJb.jpg', wrongId: 'msMkGJ', correctId: 'msMkGJb', ext: 'jpg' },
  { originalUrl: 'https://i.imgur.com/mUDXQfl.gif', wrongId: 'mUDXQf', correctId: 'mUDXQfl', ext: 'gif' },
  { originalUrl: 'https://i.imgur.com/Mugmx0l.png', wrongId: 'Mugmx0', correctId: 'Mugmx0l', ext: 'png' },
  { originalUrl: 'https://i.imgur.com/NtiZi5t.jpg', wrongId: 'NtiZi5', correctId: 'NtiZi5t', ext: 'jpg' },
  { originalUrl: 'https://i.imgur.com/nVU885s.jpg', wrongId: 'nVU885', correctId: 'nVU885s', ext: 'jpg' },
  { originalUrl: 'https://i.imgur.com/oMJmF1b.jpg', wrongId: 'oMJmF1', correctId: 'oMJmF1b', ext: 'jpg' },
  { originalUrl: 'https://i.imgur.com/psfCyNt.png', wrongId: 'psfCyN', correctId: 'psfCyNt', ext: 'png' },
  { originalUrl: 'https://i.imgur.com/QjbL6ih.png', wrongId: 'QjbL6i', correctId: 'QjbL6ih', ext: 'png' },
  { originalUrl: 'https://i.imgur.com/Tt6avAl.png', wrongId: 'Tt6avA', correctId: 'Tt6avAl', ext: 'png' },
  { originalUrl: 'https://i.imgur.com/ugdUr9l.png', wrongId: 'ugdUr9', correctId: 'ugdUr9l', ext: 'png' },
  { originalUrl: 'https://i.imgur.com/V6AQ1kl.png', wrongId: 'V6AQ1k', correctId: 'V6AQ1kl', ext: 'png' },
  { originalUrl: 'https://i.imgur.com/vFkl2kl.png', wrongId: 'vFkl2k', correctId: 'vFkl2kl', ext: 'png' },
  { originalUrl: 'https://i.imgur.com/wVxAzAl.png', wrongId: 'wVxAzA', correctId: 'wVxAzAl', ext: 'png' },
  { originalUrl: 'https://i.imgur.com/YE8Pdyb.png', wrongId: 'YE8Pdy', correctId: 'YE8Pdyb', ext: 'png' },
  { originalUrl: 'https://i.imgur.com/yoZJpIh.png', wrongId: 'yoZJpI', correctId: 'yoZJpIh', ext: 'png' },
  { originalUrl: 'https://i.imgur.com/zyvCWnm.png', wrongId: 'zyvCWn', correctId: 'zyvCWnm', ext: 'png' },
  { originalUrl: 'https://i.imgur.com/7xOURgl.png', wrongId: '7xOURg', correctId: '7xOURgl', ext: 'png' },
  { originalUrl: 'https://i.imgur.com/hJl5vbb.jpg', wrongId: 'hJl5vb', correctId: 'hJl5vbb', ext: 'jpg' },
  { originalUrl: 'https://i.imgur.com/mWRGXtm.png', wrongId: 'mWRGXt', correctId: 'mWRGXtm', ext: 'png' },
  { originalUrl: 'https://i.imgur.com/Ylygrrb.png', wrongId: 'Ylygrr', correctId: 'Ylygrrb', ext: 'png' },
];

const MIN_VALID_SIZE = 6 * 1024; // 6KB - imgur placeholders are ~5478 or ~503 bytes

/**
 * Download image from imgur. Returns the buffer or null on failure.
 */
async function downloadImage(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'image/*,*/*',
      },
    });
    if (!response.ok) {
      console.error(`    HTTP ${response.status} for ${url}`);
      return null;
    }
    return Buffer.from(await response.arrayBuffer());
  } catch (error) {
    console.error(`    Fetch error for ${url}: ${error.message}`);
    return null;
  }
}

/**
 * Delete a file if it exists.
 */
function deleteIfExists(filePath) {
  if (existsSync(filePath)) {
    unlinkSync(filePath);
    console.log(`  [DEL] ${filePath.replace(ROOT + '/', '')}`);
    return true;
  }
  return false;
}

async function main() {
  console.log('=== Fix Broken Imgur Images ===\n');
  console.log(`Total images to fix: ${FIX_LIST.length}\n`);

  let downloaded = 0;
  let failed = 0;
  let deletedFiles = 0;
  let replacements = 0;

  // Step 1: Download correct images and delete old placeholders
  console.log('--- Step 1: Download correct images & delete old files ---\n');

  for (const entry of FIX_LIST) {
    const { originalUrl, wrongId, correctId, ext } = entry;
    const correctPath = join(IMAGE_DIR, `${correctId}.${ext}`);
    const wrongPath = join(IMAGE_DIR, `${wrongId}.${ext}`);

    console.log(`[${correctId}.${ext}] (was ${wrongId}.${ext})`);

    // Download the correct image
    if (existsSync(correctPath)) {
      const stat = readFileSync(correctPath);
      if (stat.length > MIN_VALID_SIZE) {
        console.log(`  [SKIP] Already exists and looks valid (${(stat.length / 1024).toFixed(1)} KB)`);
        downloaded++;
        // Still delete old files
        deleteIfExists(wrongPath);
        deleteIfExists(join(IMAGE_DIR, `${wrongId}-640.${ext}`));
        deleteIfExists(join(IMAGE_DIR, `${wrongId}.webp`));
        deleteIfExists(join(IMAGE_DIR, `${wrongId}-640.webp`));
        continue;
      }
    }

    // Try downloading with correct ID
    const primaryUrl = `https://i.imgur.com/${correctId}.${ext}`;
    console.log(`  Downloading ${primaryUrl} ...`);
    let buffer = await downloadImage(primaryUrl);

    // If result is too small (placeholder), try the full original URL as fallback
    if (!buffer || buffer.length <= MIN_VALID_SIZE) {
      console.log(`  Primary download too small (${buffer ? buffer.length : 0} bytes), trying original URL...`);
      console.log(`  Downloading ${originalUrl} ...`);
      buffer = await downloadImage(originalUrl);
    }

    if (buffer && buffer.length > MIN_VALID_SIZE) {
      writeFileSync(correctPath, buffer);
      console.log(`  [OK] Saved ${correctId}.${ext} (${(buffer.length / 1024).toFixed(1)} KB)`);
      downloaded++;
    } else if (buffer) {
      // Save even if small - it might be a legitimately small image
      writeFileSync(correctPath, buffer);
      console.log(`  [WARN] Saved ${correctId}.${ext} but it's small (${(buffer.length / 1024).toFixed(1)} KB) - may be a placeholder`);
      downloaded++;
    } else {
      console.error(`  [FAIL] Could not download ${correctId}.${ext}`);
      failed++;
      continue;
    }

    // Delete the old placeholder file and its variants
    if (deleteIfExists(wrongPath)) deletedFiles++;
    if (deleteIfExists(join(IMAGE_DIR, `${wrongId}-640.${ext}`))) deletedFiles++;
    if (deleteIfExists(join(IMAGE_DIR, `${wrongId}.webp`))) deletedFiles++;
    if (deleteIfExists(join(IMAGE_DIR, `${wrongId}-640.webp`))) deletedFiles++;
  }

  // Step 2: Update markdown references
  console.log('\n--- Step 2: Update markdown references ---\n');

  const mdFiles = glob.sync('src/content/blog/*.md', { cwd: ROOT, absolute: true });
  const configFile = join(ROOT, 'src/config/index.json');
  const allFiles = [...mdFiles];
  if (existsSync(configFile)) {
    allFiles.push(configFile);
  }

  console.log(`Scanning ${allFiles.length} files for references to fix...\n`);

  for (const filePath of allFiles) {
    let content = readFileSync(filePath, 'utf-8');
    let fileReplacements = 0;

    for (const entry of FIX_LIST) {
      const { wrongId, correctId, ext } = entry;
      const oldRef = `/images/blog/${wrongId}.${ext}`;
      const newRef = `/images/blog/${correctId}.${ext}`;

      if (content.includes(oldRef)) {
        content = content.replaceAll(oldRef, newRef);
        fileReplacements++;
      }
    }

    if (fileReplacements > 0) {
      writeFileSync(filePath, content, 'utf-8');
      const relativePath = filePath.replace(ROOT + '/', '');
      console.log(`  [UPDATED] ${relativePath}: ${fileReplacements} reference(s) fixed`);
      replacements += fileReplacements;
    }
  }

  // Summary
  console.log('\n=== Summary ===');
  console.log(`  Images downloaded:    ${downloaded}`);
  console.log(`  Images failed:        ${failed}`);
  console.log(`  Old files deleted:    ${deletedFiles}`);
  console.log(`  Markdown references:  ${replacements} replaced`);

  if (failed > 0) {
    console.error('\nSome downloads failed. Check the logs above.');
    process.exit(1);
  }

  console.log('\nAll broken images have been fixed!');
  console.log('Next: run `node scripts/generate-image-variants.mjs` to regenerate variants.');
  process.exit(0);
}

main();

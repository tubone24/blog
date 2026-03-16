import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const IMGUR_REPLACE_REGEX = /https?:\/\/i\.imgur\.com\/([a-zA-Z0-9]+?)[sbtmlh]?\.(png|jpg|jpeg|gif)(?:\?[^\s)'"]*)?/g;

/**
 * Replace imgur URLs in a single file.
 * Returns the number of replacements made.
 */
function processFile(filePath) {
  const original = readFileSync(filePath, 'utf-8');

  let count = 0;
  const replaced = original.replace(IMGUR_REPLACE_REGEX, (_match, id, ext) => {
    count++;
    return `/images/blog/${id}.${ext}`;
  });

  if (count > 0) {
    writeFileSync(filePath, replaced, 'utf-8');
  }

  return count;
}

async function main() {
  console.log('=== Imgur URL Replacer ===\n');

  // Gather all target files
  const mdFiles = glob.sync('src/content/blog/*.md', { cwd: ROOT, absolute: true });
  const extraFiles = [
    join(ROOT, 'src/config/index.json'),
  ];

  const allFiles = [...mdFiles, ...extraFiles.filter((f) => existsSync(f))];

  console.log(`Found ${allFiles.length} files to process\n`);

  let totalReplacements = 0;
  let filesModified = 0;

  for (const filePath of allFiles) {
    const count = processFile(filePath);
    if (count > 0) {
      const relativePath = filePath.replace(ROOT + '/', '');
      console.log(`  [REPLACED] ${relativePath}: ${count} replacement(s)`);
      totalReplacements += count;
      filesModified++;
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`  Files scanned:   ${allFiles.length}`);
  console.log(`  Files modified:  ${filesModified}`);
  console.log(`  Replacements:    ${totalReplacements}`);

  if (totalReplacements === 0) {
    console.log('\nNo imgur URLs found. Nothing was changed.');
  } else {
    console.log('\nAll imgur URLs have been replaced with local paths.');
  }

  process.exit(0);
}

main();

import { readdirSync, existsSync } from 'node:fs';
import { join, dirname, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const IMAGE_DIR = join(ROOT, 'dist', 'images', 'blog');

const RESIZE_WIDTH = 640;
const WEBP_QUALITY = 80;

/**
 * Generate variants for a single image file.
 */
async function processImage(filePath) {
  const ext = extname(filePath).toLowerCase();
  const name = basename(filePath, extname(filePath));

  // Skip GIF files
  if (ext === '.gif') {
    console.log(`  [SKIP] ${basename(filePath)} (GIF, no processing)`);
    return { skipped: true };
  }

  // Skip files that are already variants (contain -640 suffix)
  if (name.endsWith('-640')) {
    return { skipped: true };
  }

  // Skip .webp source files (these are generated outputs)
  if (ext === '.webp') {
    return { skipped: true };
  }

  const resizedPath = join(IMAGE_DIR, `${name}-640${ext}`);
  const resizedWebpPath = join(IMAGE_DIR, `${name}-640.webp`);
  const originalWebpPath = join(IMAGE_DIR, `${name}.webp`);

  let generated = 0;

  // 1. Generate resized version (640px width)
  if (!existsSync(resizedPath)) {
    try {
      await sharp(filePath)
        .resize({ width: RESIZE_WIDTH, withoutEnlargement: true })
        .toFile(resizedPath);
      console.log(`  [OK] ${name}-640${ext}`);
      generated++;
    } catch (error) {
      console.error(`  [FAIL] ${name}-640${ext}: ${error.message}`);
    }
  } else {
    console.log(`  [SKIP] ${name}-640${ext} already exists`);
  }

  // 2. Generate resized WebP version (640px width)
  if (!existsSync(resizedWebpPath)) {
    try {
      await sharp(filePath)
        .resize({ width: RESIZE_WIDTH, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toFile(resizedWebpPath);
      console.log(`  [OK] ${name}-640.webp`);
      generated++;
    } catch (error) {
      console.error(`  [FAIL] ${name}-640.webp: ${error.message}`);
    }
  } else {
    console.log(`  [SKIP] ${name}-640.webp already exists`);
  }

  // 3. Generate original-size WebP version
  if (!existsSync(originalWebpPath)) {
    try {
      await sharp(filePath)
        .webp({ quality: WEBP_QUALITY })
        .toFile(originalWebpPath);
      console.log(`  [OK] ${name}.webp`);
      generated++;
    } catch (error) {
      console.error(`  [FAIL] ${name}.webp: ${error.message}`);
    }
  } else {
    console.log(`  [SKIP] ${name}.webp already exists`);
  }

  return { skipped: false, generated };
}

async function main() {
  console.log('=== Image Variant Generator ===\n');

  if (!existsSync(IMAGE_DIR)) {
    console.error(`Image directory not found: ${IMAGE_DIR}`);
    console.error('Run download-imgur.mjs first.');
    process.exit(1);
  }

  const files = readdirSync(IMAGE_DIR)
    .filter((f) => /\.(png|jpg|jpeg|gif)$/i.test(f))
    .map((f) => join(IMAGE_DIR, f));

  // Filter out variant files (already generated -640 files)
  const sourceFiles = files.filter((f) => {
    const name = basename(f, extname(f));
    return !name.endsWith('-640');
  });

  console.log(`Found ${sourceFiles.length} source images in ${IMAGE_DIR}\n`);

  if (sourceFiles.length === 0) {
    console.log('No images to process. Nothing to do.');
    process.exit(0);
  }

  let totalGenerated = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  for (const filePath of sourceFiles) {
    console.log(`Processing: ${basename(filePath)}`);
    try {
      const result = await processImage(filePath);
      if (result.skipped) {
        totalSkipped++;
      } else {
        totalGenerated += result.generated || 0;
      }
    } catch (error) {
      console.error(`  [ERROR] ${basename(filePath)}: ${error.message}`);
      totalErrors++;
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`  Source images: ${sourceFiles.length}`);
  console.log(`  Variants generated: ${totalGenerated}`);
  console.log(`  Skipped (GIF/existing): ${totalSkipped}`);
  console.log(`  Errors: ${totalErrors}`);

  if (totalErrors > 0) {
    console.error('\nSome processing failed. Check the logs above.');
    process.exit(1);
  }

  process.exit(0);
}

main();

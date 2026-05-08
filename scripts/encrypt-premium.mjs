import { encryptHTML } from 'pagecrypt/core';
import { createHmac } from 'crypto';
import { readFileSync, writeFileSync, rmSync, readdirSync, statSync } from 'fs';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '..', 'dist');
const premiumFullDir = path.join(distDir, 'premium-full');

const SITE_SECRET = process.env.SITE_SECRET;

if (!SITE_SECRET) {
  console.warn('[encrypt-premium] SITE_SECRET not set — skipping encryption');
  process.exit(0);
}

if (!existsSync(premiumFullDir)) {
  console.log('[encrypt-premium] No dist/premium-full/ found — nothing to encrypt');
  process.exit(0);
}

// Walk directory tree and collect all index.html files
function walkDir(dir, baseDir = dir) {
  const results = [];
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(fullPath, baseDir));
    } else if (entry.name === 'index.html') {
      results.push(fullPath);
    }
  }
  return results;
}

const htmlFiles = walkDir(premiumFullDir);

if (htmlFiles.length === 0) {
  console.log('[encrypt-premium] No HTML files found in dist/premium-full/');
} else {
  for (const htmlFile of htmlFiles) {
    // Derive slug from path relative to dist/premium-full/
    const relPath = path.relative(premiumFullDir, htmlFile);
    // relPath = "2026/05/08/x402-premium-test/index.html"
    const slug = relPath.replace(/\/index\.html$/, '');

    // HMAC-SHA256(SITE_SECRET, slug) — same derivation used in the Function
    const password = createHmac('sha256', SITE_SECRET).update(slug).digest('hex');

    const html = readFileSync(htmlFile, 'utf8');

    // 200k iterations: ~10x faster than default 2M, still secure for a paywall
    const encrypted = await encryptHTML(html, password, 200_000);

    const outDir = path.join(distDir, slug);
    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true });
    }
    const outFile = path.join(outDir, 'encrypted.html');
    writeFileSync(outFile, encrypted, 'utf8');
    console.log(`[encrypt-premium] Encrypted: ${slug} → dist/${slug}/encrypted.html`);
  }
}

// Remove dist/premium-full/ entirely so it cannot be accessed directly
rmSync(premiumFullDir, { recursive: true, force: true });
console.log('[encrypt-premium] Removed dist/premium-full/');

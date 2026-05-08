import { createHmac } from 'crypto';
import { readFileSync, writeFileSync, rmSync, readdirSync } from 'fs';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

config();

// pagecrypt's core.js references window.crypto directly, which throws ReferenceError in Node.js.
// Polyfill window with globalThis so `window.crypto` resolves to Node.js's built-in WebCrypto.
// This must be set BEFORE the dynamic import of pagecrypt so the polyfill is in place
// when pagecrypt's top-level await runs its loadCrypto() call.
if (typeof globalThis.window === 'undefined') {
  globalThis.window = globalThis;
}
const { encryptHTML } = await import('pagecrypt');

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

function walkDir(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(fullPath));
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
    const relPath = path.relative(premiumFullDir, htmlFile);
    const slug = relPath.replace(/\/index\.html$/, '');

    // HMAC-SHA256(SITE_SECRET, slug) — same derivation used in the Netlify Function
    const password = createHmac('sha256', SITE_SECRET).update(slug).digest('hex');

    const html = readFileSync(htmlFile, 'utf8');

    // 200k iterations: ~10x faster than default 2M, still strong enough for a paywall
    const encrypted = await encryptHTML(html, password, 200_000);

    const outDir = path.join(distDir, slug);
    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true });
    }
    writeFileSync(path.join(outDir, 'encrypted.html'), encrypted, 'utf8');
    console.log(`[encrypt-premium] Encrypted: ${slug} → dist/${slug}/encrypted.html`);
  }
}

rmSync(premiumFullDir, { recursive: true, force: true });
console.log('[encrypt-premium] Removed dist/premium-full/');

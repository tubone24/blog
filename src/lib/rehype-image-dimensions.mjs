import { visit } from 'unist-util-visit';
import sharp from 'sharp';
import path from 'node:path';
import { existsSync } from 'node:fs';

/** In-memory cache: imagePath -> { width, height } */
const dimensionCache = new Map();

/**
 * Resolve a local src (e.g. `/images/blog/foo.png`) to an absolute file path.
 */
function resolveImagePath(src) {
  return path.join(process.cwd(), 'static', src);
}

/**
 * Get image dimensions via sharp, with caching.
 * Returns { width, height } or null on failure.
 */
async function getImageDimensions(filePath) {
  if (dimensionCache.has(filePath)) {
    return dimensionCache.get(filePath);
  }

  try {
    const metadata = await sharp(filePath).metadata();
    const dims = { width: metadata.width, height: metadata.height };
    dimensionCache.set(filePath, dims);
    return dims;
  } catch (err) {
    // Cache the failure too so we don't retry
    dimensionCache.set(filePath, null);
    return null;
  }
}

export default function rehypeImageDimensions() {
  return async (tree) => {
    const imageNodes = [];

    visit(tree, 'element', (node) => {
      if (node.tagName !== 'img') return;

      const src = node.properties?.src;
      if (!src) return;

      // Only process local images starting with /images/
      if (!src.startsWith('/images/')) return;

      // Skip if width and height are already set
      if (node.properties.width && node.properties.height) return;

      imageNodes.push(node);
    });

    // Process all images in parallel
    await Promise.all(
      imageNodes.map(async (node) => {
        const src = node.properties.src;
        const filePath = resolveImagePath(src);

        if (!existsSync(filePath)) {
          console.warn(
            `[rehype-image-dimensions] File not found, skipping: ${filePath}`
          );
          return;
        }

        const dims = await getImageDimensions(filePath);

        if (!dims || !dims.width || !dims.height) {
          console.warn(
            `[rehype-image-dimensions] Could not read dimensions, skipping: ${filePath}`
          );
          return;
        }

        node.properties.width = String(dims.width);
        node.properties.height = String(dims.height);
      })
    );
  };
}

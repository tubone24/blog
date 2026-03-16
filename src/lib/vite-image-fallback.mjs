import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Vite plugin that provides fallback for image variants during development.
 * In production, resized (-640) and WebP variants exist in dist/.
 * In dev mode, only originals exist in static/, so this middleware
 * transparently serves the original when a variant is requested.
 */
export default function imageVariantFallback() {
  return {
    name: 'vite-image-variant-fallback',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || !req.url.startsWith('/images/blog/')) {
          return next();
        }

        const staticDir = join(process.cwd(), 'static');
        const filePath = join(staticDir, req.url);

        // If the requested file exists, serve it normally
        if (existsSync(filePath)) {
          return next();
        }

        // Try stripping -640 suffix
        let fallbackUrl = req.url.replace(/-640/, '');

        // Try converting .webp to original format
        if (fallbackUrl.endsWith('.webp')) {
          for (const ext of ['.png', '.jpg', '.jpeg']) {
            const tryUrl = fallbackUrl.replace(/\.webp$/, ext);
            if (existsSync(join(staticDir, tryUrl))) {
              req.url = tryUrl;
              return next();
            }
          }
        }

        // Try the fallback without -640
        if (existsSync(join(staticDir, fallbackUrl))) {
          req.url = fallbackUrl;
          return next();
        }

        next();
      });
    },
  };
}

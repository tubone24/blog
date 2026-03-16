const defaultPicture = "/images/blog/M795H8A.jpg";

export enum SizeMapping {
  smallSquare = "s",
  bigSquare = "b",
  small = "t",
  medium = "m",
  large = "l",
  huge = "h",
}

/**
 * Parse image path and return the appropriate size variant.
 * Works with local paths like '/images/blog/ABC123.png'
 *
 * For large size: returns '{id}-640.{ext}' (640px width)
 * For other sizes or GIF: returns original path unchanged
 * GIF images are never resized.
 */
export const parseImage = (
  rawImage: string,
  size: SizeMapping = SizeMapping.large,
): string => {
  if (!rawImage) {
    return defaultPicture;
  }

  // Don't resize GIF images
  if (rawImage.match(/\.gif$/i)) {
    return rawImage;
  }

  // For large size, return 640px variant
  if (size === SizeMapping.large) {
    return rawImage.replace(/\.([^.]+)$/, "-640.$1");
  }

  // For other sizes, return original (local hosting doesn't need multiple sizes)
  return rawImage;
};

/**
 * Get WebP URL for a given image path.
 * Returns the .webp version of .png/.jpg/.jpeg images.
 * GIF images return the original path.
 */
export const getWebPUrl = (imagePath: string): string | null => {
  if (!imagePath || imagePath.match(/\.gif$/i)) {
    return null;
  }
  return imagePath.replace(/\.(png|jpe?g)$/i, ".webp");
};

// Backward compatibility alias
export const parseImgur = parseImage;

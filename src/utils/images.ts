// s = Small Square (90×90)
// b = Big Square (160×160)
// t = Small Thumbnail (160×160)
// m = Medium Thumbnail (320×320)
// l = Large Thumbnail (640×640)
// h = Huge Thumbnail (1024×1024)
const defaultPicture = "M795H8A.jpg";

export enum SizeMapping {
  smallSquare = "s",
  bigSquare = "b",
  small = "t",
  medium = "m",
  large = "l",
  huge = "h",
}

export const parseImgur = (
  rawImage: string,
  size: SizeMapping = SizeMapping.large,
) => {
  if (!rawImage) {
    return `https://i.imgur.com/${defaultPicture}`;
  }

  // Don't resize the gif image
  // as there is a transparent bug in imgur
  if (rawImage.match("gif")) {
    // Prevent double http url
    if (rawImage.match("http")) {
      return rawImage;
    }
    return `https://i.imgur.com/${rawImage}`;
  }
  let mappedSize: string;
  switch (size) {
    case SizeMapping.smallSquare:
      mappedSize = SizeMapping.smallSquare;
      break;
    case SizeMapping.bigSquare:
      mappedSize = SizeMapping.bigSquare;
      break;
    case SizeMapping.small:
      mappedSize = SizeMapping.small;
      break;
    case SizeMapping.medium:
      mappedSize = SizeMapping.medium;
      break;
    case SizeMapping.large:
      mappedSize = SizeMapping.large;
      break;
    case SizeMapping.huge:
      mappedSize = SizeMapping.huge;
      break;
    default:
      mappedSize = "";
  }

  const resizedImage = rawImage.replace(/(.*)\.(.*)/, `$1${mappedSize}.$2`);
  // Prevent double http url
  if (resizedImage.match("http")) {
    return resizedImage;
  }
  return `https://i.imgur.com/${resizedImage}`;
};

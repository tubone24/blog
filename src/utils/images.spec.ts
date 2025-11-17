import { parseImgur, SizeMapping } from "./images";

describe("Images", () => {
  describe("parseImgur", () => {
    it("default jpg is Large", () => {
      expect(parseImgur("testImage.jpg")).toBe(
        "https://i.imgur.com/testImagel.jpg",
      );
    });
    it("default png is Large", () => {
      expect(parseImgur("testImage.png")).toBe(
        "https://i.imgur.com/testImagel.png",
      );
    });
    it("default gif is Large", () => {
      expect(parseImgur("testImage.gif")).toBe(
        "https://i.imgur.com/testImage.gif",
      );
    });
    it("http URL don't duplicate", () => {
      expect(parseImgur("https://i.imgur.com/testImage.png")).toBe(
        "https://i.imgur.com/testImagel.png",
      );
    });
    it("Small", () => {
      expect(parseImgur("testImage.png", SizeMapping.small)).toBe(
        "https://i.imgur.com/testImaget.png",
      );
    });
    it("Medium", () => {
      expect(parseImgur("testImage.png", SizeMapping.medium)).toBe(
        "https://i.imgur.com/testImagem.png",
      );
    });
    it("Large", () => {
      expect(parseImgur("testImage.png", SizeMapping.large)).toBe(
        "https://i.imgur.com/testImagel.png",
      );
    });
    it("Huge", () => {
      expect(parseImgur("testImage.png", SizeMapping.huge)).toBe(
        "https://i.imgur.com/testImageh.png",
      );
    });
    it("BigSquare", () => {
      expect(parseImgur("testImage.png", SizeMapping.bigSquare)).toBe(
        "https://i.imgur.com/testImageb.png",
      );
    });
    it("SmallSquare", () => {
      expect(parseImgur("testImage.png", SizeMapping.smallSquare)).toBe(
        "https://i.imgur.com/testImages.png",
      );
    });
    it("Default Image is M795H8A.jpg", () => {
      expect(parseImgur("")).toBe("https://i.imgur.com/M795H8A.jpg");
    });
    it("gif Prevent double http url", () => {
      expect(parseImgur("http://i.imgur.com/testImages.gif")).toBe(
        "http://i.imgur.com/testImages.gif",
      );
    });
    it("Invalid mapped size", () => {
      expect(parseImgur("testImages.png", "invalid!!!" as SizeMapping)).toBe(
        "https://i.imgur.com/testImages.png",
      );
    });
  });
});

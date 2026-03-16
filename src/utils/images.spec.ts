import { parseImage, parseImgur, getWebPUrl, SizeMapping } from "./images";

describe("Images", () => {
  describe("parseImage", () => {
    it("default jpg uses 640px variant", () => {
      expect(parseImage("/images/blog/testImage.jpg")).toBe(
        "/images/blog/testImage-640.jpg",
      );
    });
    it("default png uses 640px variant", () => {
      expect(parseImage("/images/blog/testImage.png")).toBe(
        "/images/blog/testImage-640.png",
      );
    });
    it("GIF is not resized", () => {
      expect(parseImage("/images/blog/testImage.gif")).toBe(
        "/images/blog/testImage.gif",
      );
    });
    it("large size returns 640px variant", () => {
      expect(parseImage("/images/blog/testImage.png", SizeMapping.large)).toBe(
        "/images/blog/testImage-640.png",
      );
    });
    it("medium returns original", () => {
      expect(parseImage("/images/blog/testImage.png", SizeMapping.medium)).toBe(
        "/images/blog/testImage.png",
      );
    });
    it("small returns original", () => {
      expect(parseImage("/images/blog/testImage.png", SizeMapping.small)).toBe(
        "/images/blog/testImage.png",
      );
    });
    it("huge returns original", () => {
      expect(parseImage("/images/blog/testImage.png", SizeMapping.huge)).toBe(
        "/images/blog/testImage.png",
      );
    });
    it("empty string returns default image", () => {
      expect(parseImage("")).toBe("/images/blog/M795H8A.jpg");
    });
  });

  describe("parseImgur (backward compat)", () => {
    it("is an alias for parseImage", () => {
      expect(parseImgur).toBe(parseImage);
    });
  });

  describe("getWebPUrl", () => {
    it("converts .png to .webp", () => {
      expect(getWebPUrl("/images/blog/test.png")).toBe(
        "/images/blog/test.webp",
      );
    });
    it("converts .jpg to .webp", () => {
      expect(getWebPUrl("/images/blog/test.jpg")).toBe(
        "/images/blog/test.webp",
      );
    });
    it("returns null for GIF", () => {
      expect(getWebPUrl("/images/blog/test.gif")).toBeNull();
    });
    it("returns null for empty string", () => {
      expect(getWebPUrl("")).toBeNull();
    });
    it("converts -640.png to -640.webp", () => {
      expect(getWebPUrl("/images/blog/test-640.png")).toBe(
        "/images/blog/test-640.webp",
      );
    });
  });
});

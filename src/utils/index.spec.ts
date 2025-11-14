import { isBrowser, parseDate } from "./index";

describe("Utils", () => {
  it("isBrowser", () => {
    // In jsdom environment (Jest 30), window is always defined
    expect(isBrowser()).toBe(true);
  });
  it("parseDate valid date", () => {
    expect(parseDate("2021-01-01")).toBe("2021/01/01");
  });
});

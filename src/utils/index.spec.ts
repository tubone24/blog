import { isBrowser, parseDate } from "./index";

describe("Utils", () => {
  it("isBrowser", () => {
    const originalWindow = { ...window };
    const windowSpy = jest.spyOn(global, "window", "get");
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    windowSpy.mockImplementation(() => ({
      ...originalWindow,
      innerWidth: 1920,
      innerHeight: 1200,
    }));
    expect(isBrowser()).toBe(true);
    windowSpy.mockRestore();
  });
  it("parseDate valid date", () => {
    expect(parseDate("2021-01-01")).toBe("2021/01/01");
  });
});

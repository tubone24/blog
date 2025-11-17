import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import Tag from "./index";
import ReactGA from "react-ga4";

// Mock react-ga4
jest.mock("react-ga4", () => ({
  event: jest.fn(),
}));

describe("Tag", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("Tag contains text", async () => {
    render(<Tag count={1} name="test" />);
    expect(screen.getByRole("link")).toHaveTextContent("test");
    expect(screen.getByRole("link")).toHaveTextContent("1");
  });
  it("Tag link is valid", async () => {
    render(<Tag count={1} name="test" />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/tag/test");
  });
  it("ReactGA event", async () => {
    render(<Tag count={1} name="test" />);
    await userEvent.click(screen.getByRole("link"));
    expect(ReactGA.event).toHaveBeenCalledWith({
      category: "Tag",
      action: `push Tag test`,
    });
  });
  it("should not have basic accessibility issues", async () => {
    const { container } = render(<Tag count={1} name="test" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

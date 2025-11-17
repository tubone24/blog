import React from "react";
import { render, screen } from "@testing-library/react";
import NavItem from "./index";
import { axe } from "jest-axe";
import ReactGA from "react-ga4";
import userEvent from "@testing-library/user-event";

// Mock react-ga4
jest.mock("react-ga4", () => ({
  event: jest.fn(),
}));

describe("Card", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("valid navitem", () => {
    render(<NavItem name="test" url="https://example.com" />);
    expect(screen.getByRole("link")).toHaveTextContent("test");
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "https://example.com"
    );
  });
  it("push tag", async () => {
    render(<NavItem name="test" url="https://example.com" />);
    const mockReactGA = jest.spyOn(ReactGA, "event");
    await userEvent.click(screen.getByRole("link"));
    expect(mockReactGA.mock.calls[0][0]).toStrictEqual({
      category: "User",
      action: `Click nav-menu: test`,
    });
  });
  it("should not have basic accessibility issues", async () => {
    const { container } = render(
      <NavItem name="test" url="https://example.com" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

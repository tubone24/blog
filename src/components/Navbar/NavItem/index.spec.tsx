import React from "react";
import { render, screen } from "@testing-library/react";
import NavItem from "./index";
import { axe } from "jest-axe";

describe("NavItem", () => {
  it("valid navitem", () => {
    render(<NavItem name="test" url="https://example.com" />);
    expect(screen.getByRole("link")).toHaveTextContent("test");
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "https://example.com",
    );
  });
  it("should not have basic accessibility issues", async () => {
    const { container } = render(
      <NavItem name="test" url="https://example.com" />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

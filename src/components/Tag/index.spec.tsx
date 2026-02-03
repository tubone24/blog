import React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import Tag from "./index";

describe("Tag", () => {
  it("Tag contains text", async () => {
    render(<Tag count={1} name="test" />);
    expect(screen.getByRole("link")).toHaveTextContent("test");
    expect(screen.getByRole("link")).toHaveTextContent("1");
  });
  it("Tag link is valid", async () => {
    render(<Tag count={1} name="test" />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/tag/test");
  });
  it.skip("should not have basic accessibility issues", async () => {
    const { container } = render(<Tag count={1} name="test" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

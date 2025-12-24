import React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import ShareBox from "./index";

describe("ShareBox", () => {
  it("Displays valid ShareBox", () => {
    render(<ShareBox url="https://example.com" />);
    expect(screen.getByTestId("share-box")).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(4);
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByTestId("GotoTopButton")).toBeInTheDocument();
  });
  it("should not have basic accessibility issues", async () => {
    const { container } = render(<ShareBox url="https://example.com" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

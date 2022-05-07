import React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import SearchBox from "./index";

describe("SearchBox", () => {
  it("Displays valid Copyright", () => {
    render(<SearchBox />);
    expect(screen.getByLabelText("SearchBox")).toBeInTheDocument();
  });
  it("should not have basic accessibility issues", async () => {
    const { container } = render(<SearchBox />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

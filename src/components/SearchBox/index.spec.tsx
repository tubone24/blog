import React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import userEvent from "@testing-library/user-event";
import SearchBox from "./index";

describe("SearchBox", () => {
  it("Displays valid Searchbox", () => {
    render(<SearchBox />);
    expect(screen.getByLabelText("SearchBox")).toBeInTheDocument();
    expect(screen.getByTestId("algolia-search-input")).toBeInTheDocument();
  });
  it("text input", async () => {
    render(<SearchBox />);
    await userEvent.type(
      screen.getByPlaceholderText("Enter the keyword..."),
      "testtest",
    );
    expect(screen.getByLabelText("SearchBox")).toBeInTheDocument();
    expect(screen.getByTestId("algolia-search-input")).toBeInTheDocument();
  });
  it("should not have basic accessibility issues", async () => {
    const { container } = render(<SearchBox />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

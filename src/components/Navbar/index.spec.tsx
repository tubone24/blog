import React from "react";
import { render, screen } from "@testing-library/react";
import Navbar from "./index";
import { axe } from "jest-axe";

describe("Card", () => {
  it("valid text and lozad image", () => {
    render(<Navbar />);
    expect(screen.getAllByRole("button")).toHaveLength(2);
    expect(screen.getByTestId("logo-img")).toHaveAttribute(
      "src",
      "/assets/logo3.svg"
    );
    expect(screen.getByTestId("logo")).toHaveTextContent(
      "Japanese IT Developer's Blog tubone BOYAKI"
    );
  });
  it("should not have basic accessibility issues", async () => {
    const { container } = render(<Navbar />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

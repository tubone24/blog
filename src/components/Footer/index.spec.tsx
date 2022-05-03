import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "./index";

describe("Footer", () => {
  it("Displays valid Copyright", () => {
    render(<Footer />);
    expect(screen.getByTestId("copyright")).toHaveTextContent(
      `Copyright ©tubone24 tubone BOYAKI 2017-${new Date().getFullYear()}`
    );
  });
  it("Displays valid Architecture", () => {
    render(<Footer />);
    expect(screen.getByText("GatsbyJS")).toHaveAttribute(
      "href",
      "https://www.gatsbyjs.com/"
    );
    expect(screen.getByText("PReact")).toHaveAttribute(
      "href",
      "https://preactjs.com/"
    );
  });
});

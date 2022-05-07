import React from "react";
import { render, screen } from "@testing-library/react";
import Navbar from "./index";
import { axe } from "jest-axe";
import ReactGA from "react-ga4";
import userEvent from "@testing-library/user-event";

describe("Card", () => {
  it("valid logo", () => {
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
  it("logo clicked", async () => {
    render(<Navbar />);
    const mockReactGA = jest.spyOn(ReactGA, "event");
    await userEvent.click(screen.getByTestId("logo"));
    expect(mockReactGA.mock.calls[0][0]).toStrictEqual({
      category: "User",
      action: "Click navbar logo",
    });
  });
  it("should not have basic accessibility issues", async () => {
    const { container } = render(<Navbar />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

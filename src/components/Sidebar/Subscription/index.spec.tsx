import React from "react";
import { render, screen } from "@testing-library/react";
import Subscription from "./index";
import { axe } from "jest-axe";
import ReactGA from "react-ga4";
import userEvent from "@testing-library/user-event";

describe("Subscription", () => {
  it("Subscription button clicked", async () => {
    render(<Subscription />);
    const mockReactGA = jest.spyOn(ReactGA, "event");
    await userEvent.click(screen.getByRole("button"));
    expect(mockReactGA.mock.calls[0][0]).toStrictEqual({
      category: "User",
      action: "push RSS Button",
    });
    mockReactGA.mockRestore();
  });
  it("should not have basic accessibility issues", async () => {
    const { container } = render(<Subscription />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

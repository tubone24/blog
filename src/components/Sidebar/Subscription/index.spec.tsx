import React from "react";
import { render } from "@testing-library/react";
import Subscription from "./index";
import { axe } from "jest-axe";

describe("Subscription", () => {
  it("should not have basic accessibility issues", async () => {
    const { container } = render(<Subscription />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

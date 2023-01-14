import React from "react";
import { render } from "@testing-library/react";
import WordCloud from "./index";
import { axe } from "jest-axe";

describe("WordCloud", () => {
  it("should not have basic accessibility issues", async () => {
    const { container } = render(<WordCloud />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

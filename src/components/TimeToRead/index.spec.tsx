import React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import TimeToRead from "./index";

describe("Content", () => {
  it("TimeToRead contains text", async () => {
    render(<TimeToRead words={5} minutes={6} />);
    expect(screen.getByTestId("countdown")).toHaveTextContent(
      "この記事は5文字で約6分で読めます",
    );
  });
  it.skip("should not have basic accessibility issues", async () => {
    const { container } = render(<TimeToRead words={5} minutes={6} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

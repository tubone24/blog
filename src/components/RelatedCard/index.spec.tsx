import React from "react";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import RelatedCard from "./index";

describe("RelatedCard", () => {
  it("should not have basic accessibility issues", async () => {
    const { container } = render(
      <RelatedCard
        title="hogehogehoge"
        date="2022-01-01"
        tags={["test"]}
        url="https://example.com"
        description="testtesttesttest"
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

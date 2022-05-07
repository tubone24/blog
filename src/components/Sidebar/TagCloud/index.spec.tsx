import React from "react";
import { render } from "@testing-library/react";
import TagCloud from "./index";
import { axe } from "jest-axe";
import { AllPost } from "@/components/Sidebar/entity";

describe("TagCloud", () => {
  const testAllPosts: AllPost[] = [
    {
      node: { frontmatter: { date: "2022-01-01", tags: ["test1", "test2"] } },
    },
    {
      node: { frontmatter: { date: "2022-01-02", tags: ["test1", "test2"] } },
    },
  ];
  it("should not have basic accessibility issues", async () => {
    const { container } = render(<TagCloud allPosts={testAllPosts} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

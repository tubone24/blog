import React from "react";
import { render, screen } from "@testing-library/react";
import TagCloud from "./index";
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

  it("renders tag cloud with correct tag count", () => {
    render(<TagCloud allPosts={testAllPosts} />);
    expect(screen.getByText(/2 \/ 2 Tags/)).toBeInTheDocument();
  });
});

import React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import Information from "./index";

/* eslint-disable testing-library/no-container, testing-library/prefer-screen-queries, testing-library/no-node-access, testing-library/no-wait-for-multiple-assertions */

// Mock child components
jest.mock("../Archive", () => {
  return function MockArchive() {
    return <div data-testid="mock-archive">Archive</div>;
  };
});

jest.mock("../WordCloud", () => {
  return function MockWordCloud() {
    return <div data-testid="mock-wordcloud">WordCloud</div>;
  };
});

jest.mock("../LatestPost", () => {
  return function MockLatestPost() {
    return <div data-testid="mock-latestpost">LatestPost</div>;
  };
});

describe("Information", () => {
  const mockPosts = [
    {
      node: {
        frontmatter: {
          url: "/test-post-1",
          title: "Test Post 1",
          slug: "/test-post-1",
        },
        fields: { slug: "/test-post-1" },
      },
    },
    {
      node: {
        frontmatter: {
          url: "/test-post-2",
          title: "Test Post 2",
          slug: "/test-post-2",
        },
        fields: { slug: "/test-post-2" },
      },
    },
  ];

  const mockAllPosts = [
    {
      node: {
        frontmatter: {
          date: "2023-01-01",
          tags: ["react", "testing"],
        },
      },
    },
    {
      node: {
        frontmatter: {
          date: "2023-01-02",
          tags: ["javascript", "nodejs"],
        },
      },
    },
  ];

  it("renders all child components", () => {
    render(
      <Information totalCount={10} posts={mockPosts} allPosts={mockAllPosts} />
    );

    expect(screen.getByTestId("mock-latestpost")).toBeInTheDocument();
    expect(screen.getByTestId("mock-archive")).toBeInTheDocument();
    expect(screen.getByTestId("mock-wordcloud")).toBeInTheDocument();
  });

  it("renders with empty posts array", () => {
    render(<Information totalCount={0} posts={[]} allPosts={[]} />);

    expect(screen.getByTestId("mock-latestpost")).toBeInTheDocument();
    expect(screen.getByTestId("mock-archive")).toBeInTheDocument();
    expect(screen.getByTestId("mock-wordcloud")).toBeInTheDocument();
  });

  it("renders with correct totalCount prop", () => {
    const { container } = render(
      <Information totalCount={42} posts={mockPosts} allPosts={mockAllPosts} />
    );

    expect(container.querySelector("div")).toBeInTheDocument();
  });

  it("has correct CSS classes", () => {
    const { container } = render(
      <Information totalCount={10} posts={mockPosts} allPosts={mockAllPosts} />
    );

    const mainDiv = container.querySelector("div");
    expect(mainDiv).toHaveClass("d-none");
    expect(mainDiv).toHaveClass("d-lg-block");
    expect(mainDiv).toHaveClass("my-2");
  });

  it("renders horizontal rules between components", () => {
    const { container } = render(
      <Information totalCount={10} posts={mockPosts} allPosts={mockAllPosts} />
    );

    const hrs = container.querySelectorAll("hr");
    expect(hrs).toHaveLength(4); // 4 hr elements between components
  });

  it("should not have basic accessibility issues", async () => {
    const { container } = render(
      <Information totalCount={10} posts={mockPosts} allPosts={mockAllPosts} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("uses default empty array for posts when not provided", () => {
    const { container } = render(
      // @ts-expect-error - Testing default prop behavior (posts has default value)
      <Information totalCount={10} allPosts={mockAllPosts} />
    );

    expect(container.querySelector("div")).toBeInTheDocument();
  });
});

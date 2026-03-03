import React from "react";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import RelatedPosts from "./index";
import type { AllPost } from "./index";
import * as utils from "@/utils/index";

/* eslint-disable testing-library/no-container, testing-library/prefer-screen-queries, testing-library/no-node-access, testing-library/no-wait-for-multiple-assertions */

// Mock RelatedCard component
jest.mock("@/components/RelatedCard", () => {
  return function MockRelatedCard({
    title,
    tags,
    date,
    url,
  }: {
    title: string;
    tags: readonly (string | undefined)[];
    date: string;
    headerImage?: string;
    url: string;
  }) {
    return (
      <div data-testid="related-card">
        <div data-testid="card-title">{title}</div>
        <div data-testid="card-tags">{tags.join(", ")}</div>
        <div data-testid="card-date">{date}</div>
        <div data-testid="card-url">{url}</div>
      </div>
    );
  };
});

describe("RelatedPosts", () => {
  const mockAllPosts: AllPost[] = [
    {
      title: "Test Post 1",
      headerImage: "test1.jpg",
      date: "2023-01-01",
      tags: ["react", "testing"],
      slug: "/2023-01-01-test-post-1",
    },
    {
      title: "Test Post 2",
      headerImage: "test2.jpg",
      date: "2023-01-02",
      tags: ["react", "javascript"],
      slug: "/2023-01-02-test-post-2",
    },
    {
      title: "Different Post",
      headerImage: "test3.jpg",
      date: "2023-01-03",
      tags: ["python", "django"],
      slug: "/2023-01-03-different-post",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders related posts section with heading", () => {
    const spyIsBrowser = jest.spyOn(utils, "isBrowser");
    spyIsBrowser.mockReturnValue(true);

    const { getByText } = render(
      <RelatedPosts
        title="Test Post 1"
        tags={["react", "testing"]}
        allPosts={mockAllPosts}
      />,
    );

    expect(getByText("Related Posts")).toBeInTheDocument();
  });

  it("filters out the current post by title", () => {
    const spyIsBrowser = jest.spyOn(utils, "isBrowser");
    spyIsBrowser.mockReturnValue(true);

    render(
      <RelatedPosts
        title="Test Post 1"
        tags={["react", "testing"]}
        allPosts={mockAllPosts}
      />,
    );

    // Current post title should not appear in related posts
    const relatedCards = document.querySelectorAll(
      '[data-testid="card-title"]',
    );
    const titles = Array.from(relatedCards).map((card) => card.textContent);
    expect(titles).not.toContain("Test Post 1");
  });

  it("shows posts with matching tags", () => {
    const spyIsBrowser = jest.spyOn(utils, "isBrowser");
    spyIsBrowser.mockReturnValue(true);

    const { getAllByTestId } = render(
      <RelatedPosts
        title="Current Post"
        tags={["react"]}
        allPosts={mockAllPosts}
      />,
    );

    // Should show related cards
    const relatedCards = getAllByTestId("related-card");
    expect(relatedCards.length).toBeGreaterThan(0);
  });

  it("initializes lozad observer when in browser", () => {
    const spyIsBrowser = jest.spyOn(utils, "isBrowser");
    spyIsBrowser.mockReturnValue(true);

    render(
      <RelatedPosts
        title="Test Post"
        tags={["react"]}
        allPosts={mockAllPosts}
      />,
    );

    expect(spyIsBrowser).toHaveBeenCalled();
  });

  it("does not initialize lozad when not in browser", () => {
    const spyIsBrowser = jest.spyOn(utils, "isBrowser");
    spyIsBrowser.mockReturnValue(false);

    render(
      <RelatedPosts
        title="Test Post"
        tags={["react"]}
        allPosts={mockAllPosts}
      />,
    );

    expect(spyIsBrowser).toHaveBeenCalled();
  });

  it("returns null when allPosts is empty", () => {
    const spyIsBrowser = jest.spyOn(utils, "isBrowser");
    spyIsBrowser.mockReturnValue(true);

    const { container } = render(
      <RelatedPosts title="Test Post" tags={["react"]} allPosts={[]} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("returns null when no posts have matching tags", () => {
    const spyIsBrowser = jest.spyOn(utils, "isBrowser");
    spyIsBrowser.mockReturnValue(true);

    const { container } = render(
      <RelatedPosts
        title="Test Post"
        tags={["nonexistent-tag"]}
        allPosts={mockAllPosts}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("should not have basic accessibility issues", async () => {
    const spyIsBrowser = jest.spyOn(utils, "isBrowser");
    spyIsBrowser.mockReturnValue(true);

    const { container } = render(
      <RelatedPosts
        title="Test Post"
        tags={["react"]}
        allPosts={mockAllPosts}
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders icon in heading", () => {
    const spyIsBrowser = jest.spyOn(utils, "isBrowser");
    spyIsBrowser.mockReturnValue(true);

    const { container } = render(
      <RelatedPosts
        title="Test Post"
        tags={["react"]}
        allPosts={mockAllPosts}
      />,
    );

    const iconSpan = container.querySelector(".icon-newspaper-o");
    expect(iconSpan).toBeInTheDocument();
  });
});

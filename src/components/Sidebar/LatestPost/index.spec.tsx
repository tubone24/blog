import React from "react";
import { render, screen } from "@testing-library/react";
import LatestPost, { Post } from "./index";
import { axe } from "jest-axe";
import ReactGA from "react-ga4";
import userEvent from "@testing-library/user-event";

describe("LatestPost", () => {
  it("has url", async () => {
    const posts: Post[] = [
      {
        node: {
          frontmatter: { url: "testUrl", slug: "testSlug", title: "testTitle" },
          fields: { slug: "testFieldsSlug" },
        },
      },
    ];
    render(<LatestPost posts={posts} totalCount={1} />);
    expect(screen.getByText("testTitle")).toHaveAttribute("href", "/testUrl");
  });
  it("has slug", async () => {
    const posts: Post[] = [
      {
        node: {
          frontmatter: { url: "", slug: "testSlug", title: "testTitle" },
          fields: { slug: "testFieldsSlug" },
        },
      },
    ];
    render(<LatestPost posts={posts} totalCount={1} />);
    expect(screen.getByText("testTitle")).toHaveAttribute("href", "/testSlug");
  });
  it("has fields slug", async () => {
    const posts: Post[] = [
      {
        node: {
          frontmatter: { url: "", slug: "", title: "testTitle" },
          fields: { slug: "testFieldsSlug" },
        },
      },
    ];
    render(<LatestPost posts={posts} totalCount={1} />);
    expect(screen.getByText("testTitle")).toHaveAttribute(
      "href",
      "/testFieldsSlug",
    );
  });
  it("total count", async () => {
    const posts: Post[] = [
      {
        node: {
          frontmatter: { url: "url", slug: "slug", title: "testTitle" },
          fields: { slug: "testFieldsSlug" },
        },
      },
    ];
    render(<LatestPost posts={posts} totalCount={1} />);
    expect(screen.getByTestId("latestArticleCount")).toHaveTextContent(
      "Recent posts 6 / 1",
    );
  });
  it("ga button clicked", async () => {
    const posts: Post[] = [
      {
        node: {
          frontmatter: { url: "url", slug: "slug", title: "testTitle" },
          fields: { slug: "testFieldsSlug" },
        },
      },
    ];
    render(<LatestPost posts={posts} totalCount={1} />);
    const mockReactGA = jest.spyOn(ReactGA, "event");
    await userEvent.click(screen.getByRole("link"));
    expect(mockReactGA.mock.calls[0][0]).toStrictEqual({
      category: "User",
      action: "Click latest-post item: testFieldsSlug",
    });
    mockReactGA.mockRestore();
  });
  it("should not have basic accessibility issues", async () => {
    const posts: Post[] = [
      {
        node: {
          frontmatter: { url: "", slug: "testSlug", title: "testTitle" },
          fields: { slug: "testFieldsSlug" },
        },
      },
    ];
    const { container } = render(<LatestPost posts={posts} totalCount={1} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

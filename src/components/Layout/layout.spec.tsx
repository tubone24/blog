import React from "react";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import Layout from "./layout";

/* eslint-disable testing-library/no-container, testing-library/prefer-screen-queries, testing-library/no-node-access, testing-library/no-wait-for-multiple-assertions */

// Mock child components
jest.mock("@/components/Transition", () => {
  return function MockTransition({
    children,
  }: {
    children: React.ReactNode;
    location: { pathname: string };
  }) {
    return <div data-testid="mock-transition">{children}</div>;
  };
});

jest.mock("@/components/Navbar", () => {
  return function MockNavbar({ isPostPage }: { isPostPage?: boolean }) {
    return (
      <div data-testid="mock-navbar" data-is-post-page={isPostPage}>
        Navbar
      </div>
    );
  };
});

jest.mock("./Head", () => {
  return function MockHead() {
    return <div data-testid="mock-head">Head</div>;
  };
});

jest.mock("@/components/Footer", () => {
  return function MockFooter() {
    return <div data-testid="mock-footer">Footer</div>;
  };
});

describe("Layout", () => {
  const mockLocation = {
    pathname: "/test-path",
  };

  it("renders all child components", () => {
    const { getByTestId } = render(
      <Layout location={mockLocation}>
        <div>Test Content</div>
      </Layout>
    );

    expect(getByTestId("mock-head")).toBeInTheDocument();
    expect(getByTestId("mock-navbar")).toBeInTheDocument();
    expect(getByTestId("mock-transition")).toBeInTheDocument();
    expect(getByTestId("mock-footer")).toBeInTheDocument();
  });

  it("renders children inside transition and container", () => {
    const { getByText, getByTestId } = render(
      <Layout location={mockLocation}>
        <div>Test Content</div>
      </Layout>
    );

    expect(getByText("Test Content")).toBeInTheDocument();
    const transition = getByTestId("mock-transition");
    expect(transition).toBeInTheDocument();
    expect(transition.querySelector(".container-fluid")).toBeInTheDocument();
  });

  it("detects post page from pathname pattern when isPostPage is not provided", () => {
    const postLocation = {
      pathname: "/2023-01-15-my-blog-post",
    };

    const { getByTestId } = render(
      <Layout location={postLocation}>
        <div>Post Content</div>
      </Layout>
    );

    const navbar = getByTestId("mock-navbar");
    expect(navbar).toHaveAttribute("data-is-post-page", "true");
  });

  it("uses pathname to determine non-post page when isPostPage is not provided", () => {
    const nonPostLocation = {
      pathname: "/about",
    };

    const { getByTestId } = render(
      <Layout location={nonPostLocation}>
        <div>About Content</div>
      </Layout>
    );

    const navbar = getByTestId("mock-navbar");
    expect(navbar).toHaveAttribute("data-is-post-page", "false");
  });

  it("uses explicit isPostPage prop when provided", () => {
    const { getByTestId } = render(
      <Layout location={mockLocation} isPostPage={true}>
        <div>Content</div>
      </Layout>
    );

    const navbar = getByTestId("mock-navbar");
    expect(navbar).toHaveAttribute("data-is-post-page", "true");
  });

  it("overrides pathname detection when isPostPage is explicitly false", () => {
    const postLocation = {
      pathname: "/2023-01-15-my-blog-post",
    };

    const { getByTestId } = render(
      <Layout location={postLocation} isPostPage={false}>
        <div>Content</div>
      </Layout>
    );

    const navbar = getByTestId("mock-navbar");
    expect(navbar).toHaveAttribute("data-is-post-page", "false");
  });

  it("should not have basic accessibility issues", async () => {
    const { container } = render(
      <Layout location={mockLocation}>
        <div>Test Content</div>
      </Layout>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("applies correct className to layout wrapper", () => {
    const { container } = render(
      <Layout location={mockLocation}>
        <div>Test Content</div>
      </Layout>
    );

    const layoutDiv = container.querySelector(".layout");
    expect(layoutDiv).toBeInTheDocument();
  });
});

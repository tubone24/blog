import React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import userEvent from "@testing-library/user-event";
import { Sidebar } from "./index";
import ReactGA from "react-ga4";
import * as utils from "@/utils/index";

/* eslint-disable testing-library/no-container, testing-library/prefer-screen-queries, testing-library/no-node-access, testing-library/no-wait-for-multiple-assertions */

// Mock react-ga4
jest.mock("react-ga4", () => ({
  event: jest.fn(),
}));

// Mock child components
jest.mock("./Information", () => {
  return function MockInformation() {
    return <div data-testid="mock-information">Information</div>;
  };
});

jest.mock("@/components/SearchBox", () => {
  return function MockSearchBox() {
    return <div data-testid="mock-searchbox">SearchBox</div>;
  };
});

jest.mock("./Subscription", () => {
  return function MockSubscription() {
    return <div data-testid="mock-subscription">Subscription</div>;
  };
});

jest.mock("./TagCloud", () => {
  return function MockTagCloud() {
    return <div data-testid="mock-tagcloud">TagCloud</div>;
  };
});

describe("Sidebar", () => {
  const mockLatestPosts = [
    {
      node: {
        frontmatter: {
          url: "/test-post-1",
          title: "Test Post 1",
          date: "2023-01-01",
        },
        fields: { slug: "/test-post-1" },
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
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders avatar image with link to portfolio", () => {
    const spyIsBrowser = jest.spyOn(utils, "isBrowser");
    spyIsBrowser.mockReturnValue(true);

    const { container } = render(
      <Sidebar
        latestPosts={mockLatestPosts}
        totalCount={10}
        allPosts={mockAllPosts}
      />
    );

    const portfolioLink = container.querySelector(
      'a[href="https://portfolio.tubone-project24.xyz/"]'
    );
    expect(portfolioLink).toBeInTheDocument();

    const avatarImg = container.querySelector('img[alt="tubone"]');
    expect(avatarImg).toHaveAttribute("src", "/assets/avater.png");
    expect(avatarImg).toHaveAttribute("alt", "tubone");
  });

  it("renders user name and soliloquy", () => {
    const spyIsBrowser = jest.spyOn(utils, "isBrowser");
    spyIsBrowser.mockReturnValue(true);

    render(
      <Sidebar
        latestPosts={mockLatestPosts}
        totalCount={10}
        allPosts={mockAllPosts}
      />
    );

    expect(screen.getByText("tubone")).toBeInTheDocument();
    expect(screen.getByText("It's my life")).toBeInTheDocument();
  });

  it("renders all social media icons with correct links", () => {
    const spyIsBrowser = jest.spyOn(utils, "isBrowser");
    spyIsBrowser.mockReturnValue(true);

    const { container } = render(
      <Sidebar
        latestPosts={mockLatestPosts}
        totalCount={10}
        allPosts={mockAllPosts}
      />
    );

    // GitHub
    const githubLink = container.querySelector(
      'a[href="https://github.com/tubone24"]'
    );
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute("title", "tubone24 github");

    // SoundCloud
    const soundcloudLink = container.querySelector(
      'a[href="https://soundcloud.com/user-453736300"]'
    );
    expect(soundcloudLink).toBeInTheDocument();
    expect(soundcloudLink).toHaveAttribute("title", "tubone24 SoundCloud");

    // Twitter
    const twitterLink = container.querySelector(
      'a[href="https://twitter.com/tubone24"]'
    );
    expect(twitterLink).toBeInTheDocument();
    expect(twitterLink).toHaveAttribute("title", "tubone24 twitter");

    // 500px
    const px500Link = container.querySelector(
      'a[href="https://500px.com/tubone24"]'
    );
    expect(px500Link).toBeInTheDocument();
    expect(px500Link).toHaveAttribute("title", "tubone24 500px");
  });

  it("renders all child components", () => {
    const spyIsBrowser = jest.spyOn(utils, "isBrowser");
    spyIsBrowser.mockReturnValue(true);

    render(
      <Sidebar
        latestPosts={mockLatestPosts}
        totalCount={10}
        allPosts={mockAllPosts}
      />
    );

    expect(screen.getByTestId("mock-information")).toBeInTheDocument();
    expect(screen.getByTestId("mock-searchbox")).toBeInTheDocument();
    expect(screen.getByTestId("mock-subscription")).toBeInTheDocument();
    expect(screen.getByTestId("mock-tagcloud")).toBeInTheDocument();
  });

  it("triggers ReactGA event when avatar image is clicked", async () => {
    const spyIsBrowser = jest.spyOn(utils, "isBrowser");
    spyIsBrowser.mockReturnValue(true);

    const { container } = render(
      <Sidebar
        latestPosts={mockLatestPosts}
        totalCount={10}
        allPosts={mockAllPosts}
      />
    );

    const mockReactGA = jest.spyOn(ReactGA, "event");
    const avatarImg = container.querySelector(
      'img[alt="tubone"]'
    ) as HTMLElement;

    await userEvent.click(avatarImg);

    expect(mockReactGA).toHaveBeenCalledWith({
      category: "User",
      action: "push tubone Avatar",
    });
  });

  it("triggers ReactGA event when source element is clicked", async () => {
    const spyIsBrowser = jest.spyOn(utils, "isBrowser");
    spyIsBrowser.mockReturnValue(true);

    const { container } = render(
      <Sidebar
        latestPosts={mockLatestPosts}
        totalCount={10}
        allPosts={mockAllPosts}
      />
    );

    const mockReactGA = jest.spyOn(ReactGA, "event");
    const sourceElement = container.querySelector("source") as HTMLElement;

    await userEvent.click(sourceElement);

    expect(mockReactGA).toHaveBeenCalledWith({
      category: "User",
      action: "push tubone Avatar",
    });
  });

  it("triggers ReactGA event when user name link is clicked", async () => {
    const spyIsBrowser = jest.spyOn(utils, "isBrowser");
    spyIsBrowser.mockReturnValue(true);

    const { container } = render(
      <Sidebar
        latestPosts={mockLatestPosts}
        totalCount={10}
        allPosts={mockAllPosts}
      />
    );

    const mockReactGA = jest.spyOn(ReactGA, "event");
    const nameLinks = container.querySelectorAll(
      'a[href="https://portfolio.tubone-project24.xyz/"]'
    );
    const nameLink = Array.from(nameLinks).find(
      (link) => link.textContent === "tubone"
    ) as HTMLElement;

    await userEvent.click(nameLink);

    expect(mockReactGA).toHaveBeenCalledWith({
      category: "User",
      action: "push tubone Avatar Str",
    });
  });

  it("renders with minimal required props", () => {
    const spyIsBrowser = jest.spyOn(utils, "isBrowser");
    spyIsBrowser.mockReturnValue(true);

    const { container } = render(
      <Sidebar
        latestPosts={mockLatestPosts}
        totalCount={10}
        allPosts={mockAllPosts}
      />
    );

    expect(container.querySelector("header")).toBeInTheDocument();
  });

  it("renders with correct CSS classes", () => {
    const spyIsBrowser = jest.spyOn(utils, "isBrowser");
    spyIsBrowser.mockReturnValue(true);

    const { container } = render(
      <Sidebar
        latestPosts={mockLatestPosts}
        totalCount={10}
        allPosts={mockAllPosts}
      />
    );

    const header = container.querySelector("header");
    expect(header).toHaveClass("site-heading");
    expect(header).toHaveClass("text-center");
  });

  it("should not have basic accessibility issues", async () => {
    const spyIsBrowser = jest.spyOn(utils, "isBrowser");
    spyIsBrowser.mockReturnValue(true);

    const { container } = render(
      <Sidebar
        latestPosts={mockLatestPosts}
        totalCount={10}
        allPosts={mockAllPosts}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Archive from "./index";
import { AllPost } from "../entity";
import { axe } from "jest-axe";
import ReactGA from "react-ga4";
import userEvent from "@testing-library/user-event";

// Mock react-ga4
jest.mock("react-ga4", () => ({
  event: jest.fn(),
}));

describe("Archive", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("has 1 post", async () => {
    const allPosts: AllPost[] = [
      {
        node: {
          frontmatter: {
            date: new Date("2022-01-01").toString(),
            tags: ["test1", "test2"],
          },
        },
      },
    ];
    render(<Archive allPosts={allPosts} />);
    expect(screen.getByTestId("Archive")).toHaveTextContent("2022");
  });
  it("has 2 posts deference year", async () => {
    const allPosts: AllPost[] = [
      {
        node: {
          frontmatter: {
            date: new Date("2022-01-01").toString(),
            tags: ["test1", "test2"],
          },
        },
      },
      {
        node: {
          frontmatter: {
            date: new Date("2021-01-01").toString(),
            tags: ["test1", "test2"],
          },
        },
      },
    ];
    render(<Archive allPosts={allPosts} />);
    expect(screen.getByTestId("Archive")).toHaveTextContent("2022");
    expect(screen.getByTestId("Archive")).toHaveTextContent("2021");
  });
  it("click event ga", async () => {
    const user = userEvent.setup();
    const allPosts: AllPost[] = [
      {
        node: {
          frontmatter: {
            date: new Date("2022-01-01").toString(),
            tags: ["test1", "test2"],
          },
        },
      },
    ];
    render(<Archive allPosts={allPosts} />);
    await user.click(screen.getByRole("link"));
    await waitFor(() => {
      expect(ReactGA.event).toHaveBeenCalledWith({
        category: "Archive",
        action: "push Archive 2022",
      });
    });
  });
  it("should not have basic accessibility issues", async () => {
    const allPosts: AllPost[] = [
      {
        node: {
          frontmatter: {
            date: new Date("2022-01-01").toString(),
            tags: ["test1", "test2"],
          },
        },
      },
    ];
    const { container } = render(<Archive allPosts={allPosts} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

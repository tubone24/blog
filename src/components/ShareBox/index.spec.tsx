import React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import userEvent from "@testing-library/user-event";
import ShareBox from "./index";
import ReactGA from "react-ga4";

describe("ShareBox", () => {
  it("Displays valid ShareBox", () => {
    render(<ShareBox url="https://example.com" />);
    expect(screen.getByTestId("share-box")).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(4);
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByTestId("GotoTopButton")).toBeInTheDocument();
  });
  it("Facebook share button clicked", async () => {
    render(<ShareBox url="https://example.com" />);
    const mockReactGA = jest.spyOn(ReactGA, "event");
    await userEvent.click(screen.getByTestId("facebook-link"));
    expect(mockReactGA.mock.calls[0][0]).toStrictEqual({
      category: "Share",
      action: "Facebook Share",
    });
    mockReactGA.mockRestore();
  });
  it("Twitter share button clicked", async () => {
    render(<ShareBox url="https://example.com" />);
    const mockReactGA = jest.spyOn(ReactGA, "event");
    await userEvent.click(screen.getByTestId("twitter-link"));
    expect(mockReactGA.mock.calls[0][0]).toStrictEqual({
      category: "Share",
      action: "Twitter Share",
    });
    mockReactGA.mockRestore();
  });
  it("Pocket share button clicked", async () => {
    render(<ShareBox url="https://example.com" />);
    const mockReactGA = jest.spyOn(ReactGA, "event");
    await userEvent.click(screen.getByTestId("pocket-link"));
    expect(mockReactGA.mock.calls[0][0]).toStrictEqual({
      category: "Share",
      action: "Pocket Share",
    });
    mockReactGA.mockRestore();
  });
  it("Hatebu share button clicked", async () => {
    render(<ShareBox url="https://example.com" />);
    const mockReactGA = jest.spyOn(ReactGA, "event");
    await userEvent.click(screen.getByTestId("hatebu-link"));
    expect(mockReactGA.mock.calls[0][0]).toStrictEqual({
      category: "Share",
      action: "Hatebu Share",
    });
    mockReactGA.mockRestore();
  });
  it("GotoTopButton share button clicked", async () => {
    render(<ShareBox url="https://example.com" />);
    const mockReactGA = jest.spyOn(ReactGA, "event");
    await userEvent.click(screen.getByTestId("GotoTopButton"));
    expect(mockReactGA.mock.calls[0][0]).toStrictEqual({
      category: "User",
      action: "Scroll to Top",
    });
    mockReactGA.mockRestore();
  });
  it("should not have basic accessibility issues", async () => {
    const { container } = render(<ShareBox url="https://example.com" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

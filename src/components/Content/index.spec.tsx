import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import Content from "./index";
import * as utils from "@/utils/index";

/* eslint-disable testing-library/no-container, testing-library/prefer-screen-queries, testing-library/no-node-access, testing-library/no-wait-for-multiple-assertions */

describe("Content", () => {
  it("Lazy Load Image", async () => {
    const testPost = `<h2>test</h2><img src="" class="lozad" alt="I am test png" data-src="test.png" data-testid="testImg" />`;
    const spyIsBrowser = jest.spyOn(utils, "isBrowser");
    spyIsBrowser.mockReturnValue(true);
    render(<Content post={testPost} />);
    expect(screen.getByTestId("innerHTML")).toHaveTextContent("test");
    expect(screen.getByTestId("testImg")).toHaveAttribute("src", "test.png");
    expect(screen.getByTestId("testImg")).toHaveAttribute(
      "data-loaded",
      "true",
    );
  });

  it("Lazy Load Image with onload animation", async () => {
    const testPost = `<h2>test</h2><img src="" class="lozad" alt="I am test png" data-src="test.png" data-testid="testImg" />`;
    const spyIsBrowser = jest.spyOn(utils, "isBrowser");
    spyIsBrowser.mockReturnValue(true);
    render(<Content post={testPost} />);

    const img = screen.getByTestId("testImg") as HTMLImageElement;

    // Trigger the onload event to test the animation class addition
    const loadEvent = new Event("load");
    img.dispatchEvent(loadEvent);

    await waitFor(() => {
      expect(img).toHaveClass("animated");
      expect(img).toHaveClass("fadeIn");
    });
  });

  it("Lazy Load background image", async () => {
    const testPost = `<h2>test</h2><div class="lozad" alt="I am test png" data-background-image="test.png" data-testid="testImg" />`;
    const spyIsBrowser = jest.spyOn(utils, "isBrowser");
    spyIsBrowser.mockReturnValue(true);
    render(<Content post={testPost} />);
    expect(screen.getByTestId("innerHTML")).toHaveTextContent("test");
    expect(screen.getByTestId("testImg")).toHaveStyle(
      "background-image: test.png",
    );
    expect(screen.getByTestId("testImg")).toHaveAttribute(
      "data-loaded",
      "true",
    );
  });

  it("should not have basic accessibility issues", async () => {
    const { container } = render(<Content post="" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

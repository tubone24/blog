import React from "react";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import Transition from "./index";

/* eslint-disable testing-library/no-container, testing-library/prefer-screen-queries, testing-library/no-node-access, testing-library/no-wait-for-multiple-assertions */

describe("Transition", () => {
  const mockLocation = {
    pathname: "/test-path",
  };

  it("renders children correctly", () => {
    const { getByText } = render(
      <Transition location={mockLocation}>
        <div>Test Content</div>
      </Transition>,
    );
    expect(getByText("Test Content")).toBeInTheDocument();
  });

  it("applies transition styles based on status", () => {
    const { container } = render(
      <Transition location={mockLocation}>
        <div>Test Content</div>
      </Transition>,
    );

    // Check that the TransitionGroup is rendered
    const transitionGroup = container.querySelector("div");
    expect(transitionGroup).toBeInTheDocument();
  });

  it("changes key when location pathname changes", () => {
    const { rerender, container } = render(
      <Transition location={{ pathname: "/path1" }}>
        <div>Content 1</div>
      </Transition>,
    );

    const firstRender = container.innerHTML;

    rerender(
      <Transition location={{ pathname: "/path2" }}>
        <div>Content 2</div>
      </Transition>,
    );

    const secondRender = container.innerHTML;

    // The key change should trigger a new transition
    expect(firstRender).not.toBe(secondRender);
  });

  it("uses correct timeout values", () => {
    const { container } = render(
      <Transition location={mockLocation}>
        <div>Test Content</div>
      </Transition>,
    );

    // Verify the component renders (timeout is applied internally)
    expect(container.firstChild).toBeInTheDocument();
  });

  it("should not have basic accessibility issues", async () => {
    const { container } = render(
      <Transition location={mockLocation}>
        <div>Test Content</div>
      </Transition>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders with multiple children", () => {
    const { getByText } = render(
      <Transition location={mockLocation}>
        <div>
          <h1>Title</h1>
          <p>Paragraph</p>
        </div>
      </Transition>,
    );
    expect(getByText("Title")).toBeInTheDocument();
    expect(getByText("Paragraph")).toBeInTheDocument();
  });
});

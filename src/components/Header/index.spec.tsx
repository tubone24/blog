import React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import Header from "./index";
import ReactGA from "react-ga4";
import userEvent from "@testing-library/user-event";

/* eslint-disable testing-library/no-container, testing-library/prefer-screen-queries, testing-library/no-node-access, testing-library/no-wait-for-multiple-assertions */

describe("Header", () => {
  it("Show Author Image", () => {
    render(
      <Header
        title="testTitle"
        authorName="testParson"
        authorImage={true}
        img="test.png"
        subTitle="testSubTitle"
      />
    );
    expect(screen.getByTestId("header")).toHaveTextContent("testTitle");
    expect(screen.getByTestId("header")).toHaveTextContent("testParson");
    expect(screen.getByTestId("header")).toHaveTextContent("testSubTitle");
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      "/assets/avater.png"
    );
  });
  it("Don't Show Author Image", () => {
    render(
      <Header
        title="testTitle"
        authorName="testParson"
        authorImage={false}
        img="test.png"
        subTitle="testSubTitle"
      />
    );
    expect(screen.getByTestId("header")).toHaveTextContent("testTitle");
    expect(screen.getByTestId("header")).toHaveTextContent("testParson");
    expect(screen.getByTestId("header")).toHaveTextContent("testSubTitle");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
  it("ReactGA event on img click", async () => {
    render(
      <Header
        title="testTitle"
        authorName="testParson"
        authorImage={true}
        img="test.png"
        subTitle="testSubTitle"
      />
    );
    const mockReactGA = jest.spyOn(ReactGA, "event");
    await userEvent.click(screen.getByRole("img"));
    expect(mockReactGA.mock.calls[0][0]).toStrictEqual({
      category: "User",
      action: "push tubone Avatar",
    });
  });

  it("ReactGA event on source click", async () => {
    const { container } = render(
      <Header
        title="testTitle"
        authorName="testParson"
        authorImage={true}
        img="test.png"
        subTitle="testSubTitle"
      />
    );
    const mockReactGA = jest.spyOn(ReactGA, "event");

    // Find the source element
    const sourceElement = container.querySelector("source");
    expect(sourceElement).toBeInTheDocument();

    // Click the source element
    await userEvent.click(sourceElement as HTMLElement);

    expect(mockReactGA).toHaveBeenCalledWith({
      category: "User",
      action: "push tubone Avatar",
    });
  });
  it("should not have basic accessibility issues", async () => {
    const { container } = render(<Header />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

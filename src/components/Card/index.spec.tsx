import React from "react";
import { render, screen } from "@testing-library/react";
import Card from "./index";
import { axe } from "jest-axe";

describe("Card", () => {
  it("valid text and lazy image (index > 0)", () => {
    render(
      <Card
        title="testTitle"
        url="https://example.com"
        index={3}
        date="2022-01-01"
        tags={["testTag1", "testTag2"]}
        description="hogehogehogehoge"
        headerImage="https://example.com/test.png"
      />,
    );
    expect(screen.getByTestId("card")).toHaveTextContent("testTitle");
    expect(screen.getByTestId("card")).toHaveTextContent("2022-01-01");
    expect(screen.getByTestId("card")).toHaveTextContent("testTag1");
    expect(screen.getByTestId("card")).toHaveTextContent("testTag2");
    expect(screen.getByTestId("card")).toHaveTextContent("hogehogehogehoge");
    expect(screen.getByTestId("card-header")).toHaveAttribute(
      "src",
      "https://example.com/testl.png",
    );
    expect(screen.getByTestId("card-header")).toHaveAttribute(
      "loading",
      "lazy",
    );
  });
  it("valid text and eager image (index === 0)", () => {
    render(
      <Card
        title="testTitle"
        url="https://example.com"
        index={0}
        date="2022-01-01"
        tags={["testTag1", "testTag2"]}
        description="hogehogehogehoge"
        headerImage="https://example.com/test.png"
      />,
    );
    expect(screen.getByTestId("card")).toHaveTextContent("testTitle");
    expect(screen.getByTestId("card")).toHaveTextContent("2022-01-01");
    expect(screen.getByTestId("card")).toHaveTextContent("testTag1");
    expect(screen.getByTestId("card")).toHaveTextContent("testTag2");
    expect(screen.getByTestId("card")).toHaveTextContent("hogehogehogehoge");
    // For index === 0, eager loading is applied (LCP optimization)
    expect(screen.getByTestId("card-header")).toHaveAttribute(
      "src",
      "https://example.com/testl.png",
    );
    expect(screen.getByTestId("card-header")).toHaveAttribute(
      "loading",
      "eager",
    );
  });
  it("undefined tag", () => {
    render(
      <Card
        title="testTitle"
        url="https://example.com"
        index={1}
        date="2022-01-01"
        tags={[undefined]}
        description="hogehogehogehoge"
        headerImage="https://example.com/test.png"
      />,
    );
    expect(screen.getByTestId("card")).toHaveTextContent("testTitle");
    expect(screen.getByTestId("card")).toHaveTextContent("2022-01-01");
    expect(screen.queryByText("testTag1")).not.toBeInTheDocument();
    expect(screen.queryByText("testTag2")).not.toBeInTheDocument();
    expect(screen.getByTestId("card-header")).toHaveAttribute(
      "src",
      "https://example.com/testl.png",
    );
  });
  it("should not have basic accessibility issues", async () => {
    const { container } = render(
      <Card
        title="testTitle"
        url="https://example.com"
        index={0}
        date="2022-01-01"
        tags={["testTag1", "testTag2"]}
        description="hogehogehogehoge"
        headerImage="https://example.com/test.png"
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

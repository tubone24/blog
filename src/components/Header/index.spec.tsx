import React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import Header from "./index";
import ReactGA from "react-ga4";
import userEvent from "@testing-library/user-event";

describe("Header", () => {
  it("Show Author Image", () => {
    render(
      <Header
        title="testTitle"
        authorName="testParson"
        authorImage={true}
        img="test.png"
        subTitle="testSubTitle"
      />,
    );
    expect(screen.getByTestId("header")).toHaveTextContent("testTitle");
    expect(screen.getByTestId("header")).toHaveTextContent("testParson");
    expect(screen.getByTestId("header")).toHaveTextContent("testSubTitle");
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      "/assets/avater.png",
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
      />,
    );
    expect(screen.getByTestId("header")).toHaveTextContent("testTitle");
    expect(screen.getByTestId("header")).toHaveTextContent("testParson");
    expect(screen.getByTestId("header")).toHaveTextContent("testSubTitle");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
  it("ReactGA event", async () => {
    render(
      <Header
        title="testTitle"
        authorName="testParson"
        authorImage={true}
        img="test.png"
        subTitle="testSubTitle"
      />,
    );
    const mockReactGA = jest.spyOn(ReactGA, "event");
    await userEvent.click(screen.getByRole("img"));
    expect(mockReactGA.mock.calls[0][0]).toStrictEqual({
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

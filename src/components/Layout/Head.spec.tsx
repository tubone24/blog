import { render } from "@testing-library/react";
import React from "react";

import Head from "./Head";

jest.mock("react-helmet", () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require("react");
  const plugin = jest.requireActual("react-helmet");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockHelmet = ({ children, ...props }: any) =>
    React.createElement(
      "div",
      {
        ...props,
        className: "mock-helmet",
      },
      children
    );
  return {
    ...plugin,
    Helmet: jest.fn().mockImplementation(mockHelmet),
  };
});

describe("Head", () => {
  it("Set meta tag", () => {
    render(<Head />, {
      container: document.head,
    });
    expect(
      document
        // eslint-disable-next-line testing-library/no-node-access
        .querySelector("meta[name='description']")
        ?.attributes.getNamedItem("content")?.value
    ).toBe(
      "tubone BOYAKI is the developer blog by tubone who is Japanese IT Developer"
    );
    expect(
      document
        // eslint-disable-next-line testing-library/no-node-access
        .querySelector("meta[name='keyword']")
        ?.attributes.getNamedItem("content")?.value
    ).toBe("blog, tubone, IT, Developer, Python, GitHub, Nuxt.js");
    expect(
      document
        // eslint-disable-next-line testing-library/no-node-access
        .querySelector("meta[name='theme-color']")
        ?.attributes.getNamedItem("content")?.value
    ).toBe("#33b546");
    expect(
      document
        // eslint-disable-next-line testing-library/no-node-access
        .querySelector("meta[name='msapplication-navbutton-color']")
        ?.attributes.getNamedItem("content")?.value
    ).toBe("#33b546");
    expect(
      document
        // eslint-disable-next-line testing-library/no-node-access
        .querySelector("meta[name='google-site-verification']")
        ?.attributes.getNamedItem("content")?.value
    ).toBe("--LalgZ9bPi0TeRovPWh1jMxI1TuCs0dESPlyDtR_EQ");
  });
});

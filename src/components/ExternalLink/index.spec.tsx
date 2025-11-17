import React from "react";
import { render, screen } from "@testing-library/react";
import ExternalLink from "./index";

describe("ExternalLink", () => {
  it("valid href", () => {
    render(<ExternalLink href="https://example.com/" title="HelloWorld" />);
    expect(screen.getByText("HelloWorld")).toHaveAttribute(
      "href",
      "https://example.com/",
    );
  });
  it("default is target=_blank rel=external nofollow noopener", () => {
    render(<ExternalLink href="https://example.com/" title="HelloWorld" />);
    expect(screen.getByText("HelloWorld")).toHaveAttribute("target", "_blank");
    expect(screen.getByText("HelloWorld")).toHaveAttribute(
      "rel",
      "external nofollow noopener",
    );
  });
});

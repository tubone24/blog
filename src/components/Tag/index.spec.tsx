import React from "react";
import { render, screen } from "@testing-library/react";
import Tag from "./index";

describe("Tag", () => {
  it("Tag contains text", async () => {
    render(<Tag count={1} name="test" />);
    expect(screen.getByRole("link")).toHaveTextContent("test");
    expect(screen.getByRole("link")).toHaveTextContent("1");
  });
  it("Tag link is valid", async () => {
    render(<Tag count={1} name="test" />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/tag/test");
  });
});

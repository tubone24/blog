import React from "react";
import { render, screen } from "@testing-library/react";
import GitalkFC from "./index";

describe("GitalkFC", () => {
  it("Mount", () => {
    render(
      <GitalkFC
        id="dummy"
        title="dummyTitle"
        clientId="aaa"
        clientSecret="bbb"
      />
    );
    expect(screen.getByTestId("gitalk-container")).toHaveAttribute(
      "id",
      "gitalk-container"
    );
    // gitalk is third party tool
    // eslint-disable-next-line testing-library/no-node-access
    expect(screen.getByTestId("gitalk-container").children).not.toBeNull();
  });
});

import { render } from "@testing-library/react";
import React from "react";
import { HelmetProvider } from "react-helmet-async";

import Head from "./Head";

describe("Head", () => {
  it("renders Head component without errors", () => {
    const { container } = render(
      <HelmetProvider>
        <Head />
      </HelmetProvider>
    );

    // Basic smoke test - component renders without throwing errors
    expect(container).toBeDefined();
  });
});

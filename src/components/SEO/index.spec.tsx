import React from "react";
import { render } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import SEO from "./index";

describe("SEO", () => {
  it("should render SEO component without errors", () => {
    const { container } = render(
      <HelmetProvider>
        <SEO
          url="https://example.com"
          title="testTitle"
          siteTitleAlt="testSiteTitleAlt"
          isPost={false}
          image="https://example.com/test.png"
          tag="testTag"
          description="testDescription"
        />
      </HelmetProvider>
    );

    // Basic smoke test - component renders without throwing errors
    expect(container).toBeDefined();
  });
});

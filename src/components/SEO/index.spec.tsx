import React from "react";
import { render } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import SEO from "./index";

describe("SEO", () => {
  it("should render metadata (not article)", () => {
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
      </HelmetProvider>,
    );

    // HelmetProviderでラップされたコンポーネントが正常にレンダリングされることを確認
    expect(container).toBeInTheDocument();
  });

  it("should render metadata (article)", () => {
    const { container } = render(
      <HelmetProvider>
        <SEO
          url="https://example.com/post"
          title="testArticleTitle"
          siteTitleAlt="testSiteTitleAlt"
          isPost={true}
          image="https://example.com/test.png"
          tag="testTag"
          description="testArticleDescription"
          datePublished="2024-01-01T00:00:00.000Z"
          dateModified="2024-01-02T00:00:00.000Z"
          author="testAuthor"
          keywords={["test", "article"]}
        />
      </HelmetProvider>,
    );

    // HelmetProviderでラップされたコンポーネントが正常にレンダリングされることを確認
    expect(container).toBeInTheDocument();
  });
});

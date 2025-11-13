/* eslint-disable testing-library/no-node-access */
import React from "react";
import { render } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import SEO from "./index";

describe("SEO", () => {
  it("should render metadata (not article)", () => {
    render(
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

    // react-helmet-asyncではDOMから直接取得する必要がある
    expect(document.title).toBe("testTitle");

    const description = document.querySelector('meta[name="description"]');
    expect(description?.getAttribute("content")).toBe("testDescription");

    const image = document.querySelector('meta[name="image"]');
    expect(image?.getAttribute("content")).toBe("https://example.com/test.png");

    const ogUrl = document.querySelector('meta[property="og:url"]');
    expect(ogUrl?.getAttribute("content")).toBe("https://example.com");

    const ogType = document.querySelector('meta[property="og:type"]');
    expect(ogType?.getAttribute("content")).toBe("website");

    const ogTitle = document.querySelector('meta[property="og:title"]');
    expect(ogTitle?.getAttribute("content")).toBe("testTitle");

    const ogDescription = document.querySelector(
      'meta[property="og:description"]'
    );
    expect(ogDescription?.getAttribute("content")).toBe("testDescription");

    const ogImage = document.querySelector('meta[property="og:image"]');
    expect(ogImage?.getAttribute("content")).toBe(
      "https://tubone-project24.xyz/ogp.png?title=testTitle"
    );

    const fbAppId = document.querySelector('meta[property="fb:app_id"]');
    expect(fbAppId?.getAttribute("content")).toBe("280941406476272");

    const twitterCard = document.querySelector('meta[name="twitter:card"]');
    expect(twitterCard?.getAttribute("content")).toBe("summary_large_image");

    const twitterCreator = document.querySelector(
      'meta[name="twitter:creator"]'
    );
    expect(twitterCreator?.getAttribute("content")).toBe("@tubone24");

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    expect(twitterTitle?.getAttribute("content")).toBe("testTitle");

    const twitterDescription = document.querySelector(
      'meta[name="twitter:description"]'
    );
    expect(twitterDescription?.getAttribute("content")).toBe("testDescription");

    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    expect(twitterImage?.getAttribute("content")).toBe(
      "https://tubone-project24.xyz/ogp.png?title=testTitle"
    );
  });
});

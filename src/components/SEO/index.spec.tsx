import React from "react";
import { render } from "@testing-library/react";
import { Helmet } from "react-helmet-async";
import SEO from "./index";

describe("SEO", () => {
  // it("should render metadata", () => {
  //   render(
  //     <SEO
  //       url="https://example.com"
  //       title="testTitle"
  //       siteTitleAlt="testSiteTitleAlt"
  //       isPost={true}
  //       image="https://example.com/test.png"
  //       tag="testTag"
  //       description="testDescription"
  //     />
  //   );
  //   const helmet = Helmet.peek();
  //   expect(helmet.title).toBe("testTitle");
  //   let description = "";
  //   let image = "";
  //   let ogUrl = "";
  //   let ogType = "";
  //   let ogTitle = "";
  //   let ogDescription = "";
  //   let ogImage = "";
  //   let fbAppId = "";
  //   let twitterCard = "";
  //   let twitterCreator = "";
  //   let twitterTitle = "";
  //   let twitterDescription = "";
  //   let twitterImage = "";
  //   for (const content of helmet.metaTags) {
  //     if (content.name === "description") {
  //       description = content.content;
  //     }
  //     if (content.name === "image") {
  //       image = content.content;
  //     }
  //     if ((content as any).property === "og:url") {
  //       ogUrl = content.content;
  //     }
  //     if ((content as any).property === "og:type") {
  //       ogType = content.content;
  //     }
  //     if ((content as any).property === "og:title") {
  //       ogTitle = content.content;
  //     }
  //     if ((content as any).property === "og:description") {
  //       ogDescription = content.content;
  //     }
  //     if ((content as any).property === "og:image") {
  //       ogImage = content.content;
  //     }
  //     if ((content as any).property === "fb:app_id") {
  //       fbAppId = content.content;
  //     }
  //     if (content.name === "twitter:card") {
  //       twitterCard = content.content;
  //     }
  //     if (content.name === "twitter:creator") {
  //       twitterCreator = content.content;
  //     }
  //     if (content.name === "twitter:title") {
  //       twitterTitle = content.content;
  //     }
  //     if (content.name === "twitter:description") {
  //       twitterDescription = content.content;
  //     }
  //     if (content.name === "twitter:image") {
  //       twitterImage = content.content;
  //     }
  //   }
  //   expect(description).toBe("testDescription");
  //   expect(image).toBe("https://example.com/test.png");
  //   expect(ogUrl).toBe("https://example.com");
  //   expect(ogType).toBe("article");
  //   expect(ogTitle).toBe("testTitle");
  //   expect(ogDescription).toBe("testDescription");
  //   expect(ogImage).toBe("https://tubone-project24.xyz/ogp.png?title=testTitle");
  //   expect(fbAppId).toBe("280941406476272");
  //   expect(twitterCard).toBe("summary_large_image");
  //   expect(twitterCreator).toBe("@tubone24");
  //   expect(twitterTitle).toBe("testTitle");
  //   expect(twitterDescription).toBe("testDescription");
  //   expect(twitterImage).toBe(
  //     "https://tubone-project24.xyz/ogp.png?title=testTitle"
  //   );
  // });
  it("should render metadata (not article)", () => {
    render(
      <SEO
        url="https://example.com"
        title="testTitle"
        siteTitleAlt="testSiteTitleAlt"
        isPost={false}
        image="https://example.com/test.png"
        tag="testTag"
        description="testDescription"
      />
    );
    const helmet = Helmet.peek();
    expect(helmet.title).toBe("testTitle");
    let description = "";
    let image = "";
    let ogUrl = "";
    let ogType = "";
    let ogTitle = "";
    let ogDescription = "";
    let ogImage = "";
    let fbAppId = "";
    let twitterCard = "";
    let twitterCreator = "";
    let twitterTitle = "";
    let twitterDescription = "";
    let twitterImage = "";
    for (const content of helmet.metaTags) {
      if (content.name === "description") {
        description = content.content;
      }
      if (content.name === "image") {
        image = content.content;
      }
      if ((content as any).property === "og:url") {
        ogUrl = content.content;
      }
      if ((content as any).property === "og:type") {
        ogType = content.content;
      }
      if ((content as any).property === "og:title") {
        ogTitle = content.content;
      }
      if ((content as any).property === "og:description") {
        ogDescription = content.content;
      }
      if ((content as any).property === "og:image") {
        ogImage = content.content;
      }
      if ((content as any).property === "fb:app_id") {
        fbAppId = content.content;
      }
      if (content.name === "twitter:card") {
        twitterCard = content.content;
      }
      if (content.name === "twitter:creator") {
        twitterCreator = content.content;
      }
      if (content.name === "twitter:title") {
        twitterTitle = content.content;
      }
      if (content.name === "twitter:description") {
        twitterDescription = content.content;
      }
      if (content.name === "twitter:image") {
        twitterImage = content.content;
      }
    }
    expect(description).toBe("testDescription");
    expect(image).toBe("https://example.com/test.png");
    expect(ogUrl).toBe("https://example.com");
    expect(ogType).toBe("website");
    expect(ogTitle).toBe("testTitle");
    expect(ogDescription).toBe("testDescription");
    expect(ogImage).toBe(
      "https://tubone-project24.xyz/ogp.png?title=testTitle"
    );
    expect(fbAppId).toBe("280941406476272");
    expect(twitterCard).toBe("summary_large_image");
    expect(twitterTitle).toBe("testTitle");
    expect(twitterCreator).toBe("@tubone24");
    expect(twitterDescription).toBe("testDescription");
    expect(twitterImage).toBe(
      "https://tubone-project24.xyz/ogp.png?title=testTitle"
    );
  });
});

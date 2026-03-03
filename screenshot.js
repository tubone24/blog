const { chromium } = require("playwright");

async function takeScreenshots() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 1024 },
  });

  try {
    // ホームページ
    console.log("Taking screenshot of home page...");
    await page.goto("http://localhost:4321/", { waitUntil: "networkidle" });
    await page.screenshot({ path: "/tmp/astro_home.png", fullPage: true });
    console.log("Saved: /tmp/astro_home.png");

    // ページ2
    console.log("Taking screenshot of page 2...");
    await page.goto("http://localhost:4321/pages/2/", {
      waitUntil: "networkidle",
    });
    await page.screenshot({ path: "/tmp/astro_page2.png", fullPage: true });
    console.log("Saved: /tmp/astro_page2.png");

    // 最初の記事ページを取得（相対URLのリンク）
    console.log("Getting first article link...");
    await page.goto("http://localhost:4321/", { waitUntil: "networkidle" });

    // すべてのリンクを取得
    const links = await page.locator("a").all();
    console.log("Found links:", links.length);

    let articleHref = null;
    for (const link of links) {
      const href = await link.getAttribute("href");
      // 記事ページのリンク（日付形式を含む相対リンク）
      if (
        href &&
        (href.startsWith("2026") ||
          href.startsWith("2025") ||
          href.startsWith("2024"))
      ) {
        articleHref = href;
        console.log("First article link:", articleHref);
        break;
      }
    }

    if (articleHref) {
      console.log("Taking screenshot of article page...");
      await page.goto(`http://localhost:4321/${articleHref}`, {
        waitUntil: "networkidle",
      });
      await page.screenshot({ path: "/tmp/astro_article.png", fullPage: true });
      console.log("Saved: /tmp/astro_article.png");
    } else {
      console.log("Could not find article link");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await browser.close();
  }
}

takeScreenshots();

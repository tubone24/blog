const url = () => {
  const url = process.env["URL"] || "https://tubone-project24.xyz";
  console.log(url);
  return url;
};

const action = async (page) => {
  try {
    // Wait for page to be fully loaded
    await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log("Looking for first tag link...");

    // Find first tag link on the page
    let link = await page.$('a[href^="/tag/"]');

    if (!link) {
      // Fallback to XPath
      const elements = await page.$x("//a[contains(@href, '/tag/')]");
      link = elements[0];
      // clean up external references from memlab
      await Promise.all(elements.slice(1).map((e) => e.dispose()));
    }

    if (link) {
      console.log("Found tag link, clicking...");
      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle2", timeout: 15000 }),
        link.click(),
      ]);
      console.log("Navigation to tag page completed");
    } else {
      console.error("Tag link not found");
    }
  } catch (error) {
    console.error("Error in action:", error.message);
    throw error;
  }
};

const back = async (page) => {
  try {
    // Wait before clicking
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Looking for logo...");

    // Wait for logo to be available
    await page.waitForSelector('[data-testid="logo"]', { timeout: 10000 });

    console.log("Found logo, clicking...");

    // Return Top page via clicking logo
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle2", timeout: 15000 }),
      page.click('[data-testid="logo"]'),
    ]);

    console.log("Navigation back to top completed");
  } catch (error) {
    console.error("Error in back:", error.message);
    throw error;
  }
};

module.exports = { action, back, url };

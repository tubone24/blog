const url = () => {
  const url = process.env["URL"] || "https://tubone-project24.xyz";
  console.log(url);
  return url;
};

const action = async (page) => {
  // Go to the about page and catch memory leaks
  try {
    // Wait for navigation to be available
    await page.waitForSelector('a[href*="/about/"]', { timeout: 5000 });
    await page.click('a[href*="/about/"]');
  } catch (error) {
    console.log("About link not found, trying alternative selector");
    // Alternative approach using text content
    const aboutButton = await page.evaluateHandle(() => {
      const links = Array.from(document.querySelectorAll("a"));
      return links.find((link) => link.textContent.includes("About"));
    });
    if (aboutButton) {
      await aboutButton.click();
      await aboutButton.dispose();
    }
  }
};

const back = async (page) => {
  // Return Top page via direct navigation to avoid page reload
  await page.evaluate(() => {
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
};

module.exports = { action, back, url };

const url = () => {
  const url = process.env["URL"] || "https://blog.tubone-project24.xyz";
  console.log(url);
  return url;
};

const action = async (page) => {
  // Go to the about page and catch memory leaks
  const elements = await page.$x("//a[contains(., 'About')]");
  const [link] = elements;
  if (link) {
    await link.click();
  }
  // clean up external references from memlab
  await Promise.all(elements.map((e) => e.dispose()));
};

const back = async (page) => {
  // Return Top page via clicking logo
  await page.click('[data-testid="logo"]');
};

module.exports = { action, back, url };
// test

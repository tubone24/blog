const url = () => {
  return "https://blog.tubone-project24.xyz";
};

const action = async (page) => {
  const elements = await page.$x("//a[contains(., 'About')]");
  const [link] = elements;
  if (link) {
    await link.click();
  }
  // clean up external references from memlab
  await Promise.all(elements.map((e) => e.dispose()));

  const elements2 = await page.$x("//a[contains(., 'Tag')]");
  const [link2] = elements2;
  if (link2) {
    await link2.click();
  }
  // clean up external references from memlab
  await Promise.all(elements2.map((e) => e.dispose()));
};

const back = async (page) => {
  await page.click('a[href="/"]');
};

module.exports = { action, back, url };

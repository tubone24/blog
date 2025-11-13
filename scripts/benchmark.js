// refs: https://github.com/reireias/reireias.github.io/blob/source/scripts/benchmark.js

/* eslint no-console: 0 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const qs = require("qs");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require("axios");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dayjs = require("dayjs");
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

const TARGET_URL = process.argv[2];
const VERSION = process.argv[3];
const PAGE_SPEED_INSIGHTS_URL =
  "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

const saveJsonFile = (obj, client) => {
  const dateString = dayjs().format("YYYYMMDDHHmmSSS");

  // Ensure directories exist
  if (!fs.existsSync("./benchmark")) {
    fs.mkdirSync("./benchmark");
  }
  if (!fs.existsSync("./benchmark/raw")) {
    fs.mkdirSync("./benchmark/raw");
  }

  const path = `./benchmark/raw/${client}-raw-${dateString}-${VERSION}.json`;
  fs.writeFileSync(path, JSON.stringify(obj));
  const lhPath = `./benchmark/${client}-lh-${dateString}-${VERSION}.json`;
  fs.writeFileSync(lhPath, JSON.stringify(obj.lighthouseResult));
};

const summarizeScore = (obj, client) => {
  const dateString = dayjs().format("YYYYMMDDHHmmSSS");

  // Ensure summary directory exists
  if (!fs.existsSync("./benchmark/summary")) {
    fs.mkdirSync("./benchmark/summary", { recursive: true });
  }

  const path = `./benchmark/summary/${client}-${dateString}-${VERSION}.txt`;
  const lighthouseResult = obj.lighthouseResult;
  const summaryText = `performance: ${
    lighthouseResult.categories.performance.score * 100
  }\naccessibility: ${
    lighthouseResult.categories.accessibility.score * 100
  }\nbest-practices: ${
    lighthouseResult.categories["best-practices"].score * 100
  }\nseo: ${lighthouseResult.categories.seo.score * 100}\npwa: ${
    lighthouseResult.categories.pwa.score * 100
  }`;
  fs.writeFileSync(path, summaryText);
};

const main = async () => {
  console.log(`Starting benchmark for URL: ${TARGET_URL}`);
  console.log(`Version: ${VERSION}`);

  for (const client of ["desktop", "mobile"]) {
    console.log(`\nRunning PageSpeed Insights for ${client}...`);
    const params = {
      url: TARGET_URL,
      locale: "ja",
      category: [
        "accessibility",
        "best-practices",
        "performance",
        "pwa",
        "seo",
      ],
      strategy: client,
    };
    if (process.env.PAGE_SPEED_INSIGHTS_URL) {
      params.key = process.env.PAGE_SPEED_INSIGHTS_URL;
    }

    try {
      const result = await axios.get(PAGE_SPEED_INSIGHTS_URL, {
        params,
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
      });

      if (result.status !== 200) {
        console.error(`Failed with status: ${result.status}`);
        console.error(result);
        throw new Error("Insight failed.");
      }

      console.log(`Successfully retrieved ${client} results`);
      saveJsonFile(result.data, client);
      summarizeScore(result.data, client);
      console.log(`Saved results for ${client}`);
    } catch (error) {
      console.error(`Error running PageSpeed Insights for ${client}:`);
      console.error(error.message);
      if (error.response) {
        console.error(`Response status: ${error.response.status}`);
        console.error(`Response data:`, error.response.data);
      }
      throw error;
    }
  }

  console.log("\nBenchmark completed successfully!");
};
(async () => {
  try {
    await main();
  } catch (err) {
    console.error("\nBenchmark failed:");
    console.error(err);
    process.exit(1);
  }
})();

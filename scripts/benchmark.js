// refs: https://github.com/reireias/reireias.github.io/blob/source/scripts/benchmark.js

/* eslint no-console: 0 */
const fs = require('fs');
const qs = require('qs');
const axios = require('axios');
const dayjs = require('dayjs');
require('dotenv').config();

const TARGET_URL = process.argv[2];
const VERSION = process.argv[3];
const PAGE_SPEED_INSIGHTS_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

const saveJsonFile = (obj, client) => {
  const dateString = dayjs().format('yyyymmddhhMMss');
  const path = `./benchmark/raw/${client}-raw-${dateString}-${VERSION}.json`;
  fs.writeFileSync(path, JSON.stringify(obj));
  const lhPath = `./benchmark/${client}-lh-${dateString}-${VERSION}.json`;
  fs.writeFileSync(lhPath, JSON.stringify(obj.lighthouseResult));
};

const main = async () => {
  ['desktop', 'mobile'].forEach(async (client) => {
    const params = {
      url: TARGET_URL,
      locale: 'ja',
      category: [
        'accessibility',
        'best-practices',
        'performance',
        'pwa',
        'seo',
      ],
      strategy: client,
    };
    if (process.env.PAGE_SPEED_INSIGHTS_URL) {
      params.key = process.env.PAGE_SPEED_INSIGHTS_URL;
    }
    const result = await axios.get(PAGE_SPEED_INSIGHTS_URL, {
      params,
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
    });

    if (result.status !== 200) {
      console.error(result);
      throw new Error('Insight failed.');
    }

    saveJsonFile(result.data, client);
  });
};
(async () => {
  try {
    await main();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
})();

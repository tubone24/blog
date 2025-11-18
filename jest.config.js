// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

module.exports = {
  setupFilesAfterEnv: [
    path.resolve(__dirname, "./jest-configs/setup-test-env.js"),
  ],
  transform: {
    "\\.svg": "<rootDir>/jest-configs/__mocks__/svgTransform.js",
    "^.+\\.(tsx?|jsx?)$": `<rootDir>/jest-configs/jest-preprocess.js`,
  },
  moduleNameMapper: {
    "\\.svg": `<rootDir>/jest-configs/__mocks__/svgTransform.js`,
    "typeface-*": "identity-obj-proxy",
    ".+\\.(css|styl|less|sass|scss)$": `identity-obj-proxy`,
    ".+\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": `<rootDir>/jest-configs/__mocks__/file-mocks.js`,
  },
  testPathIgnorePatterns: [
    `node_modules`,
    `.cache`,
    `public`,
    `cypress`,
    `storybook-static`,
    `.storybook`,
  ],
  modulePathIgnorePatterns: [`.storybook`],
  transformIgnorePatterns: [`node_modules/(?!(gatsby)/)`, `\\.svg`],
  globals: {
    __PATH_PREFIX__: ``,
  },
  testRegex: "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx)$",
  moduleFileExtensions: ["ts", "tsx", "js", "json"],
  collectCoverage: false,
  coverageReporters: ["lcov", "text", "html"],
  testEnvironment: "jsdom",
};

const eslintrc = {
  extends: [
    "plugin:prettier/recommended",
    "prettier",
    "plugin:json/recommended",
    "react-app",
    "plugin:cypress/recommended",
    // "plugin:react-hooks/recommended", // react-appに含まれているため削除
    "plugin:jest-dom/recommended",
    "plugin:jest/recommended",
    "plugin:jest/style",
    // "plugin:storybook/recommended" // 一時的に無効化
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["jest-dom", "testing-library", "jest"],
  settings: {
    "import/core-modules": [
      "react",
      "react-dom",
      "react-router-dom",
      "config",
      "react-helmet",
    ],
  },
  rules: {
    "no-unused-vars": "off", // duplicate @typescript-eslint/no-unused-vars
    "jest/consistent-test-it": ["error", { fn: "it" }],
    "jest/require-top-level-describe": ["error"],
  },
  env: {
    browser: true,
    "jest/globals": true,
  },
  overrides: [
    {
      files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
      extends: ["plugin:testing-library/react"],
    },
  ],
};

module.exports = eslintrc;

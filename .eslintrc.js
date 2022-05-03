const eslintrc = {
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier",
    "plugin:json/recommended",
    "react-app",
    "plugin:cypress/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jest-dom/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "jest-dom", "testing-library"],
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
  },
  env: {
    browser: true,
  },
  overrides: [
    {
      files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
      extends: ["plugin:testing-library/react"],
    },
  ],
};

module.exports = eslintrc;

const eslintrc = {
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier",
    "plugin:json/recommended",
    "react-app",
    "plugin:cypress/recommended",
    "plugin:react-hooks/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
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
};

module.exports = eslintrc;

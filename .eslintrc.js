const eslintrc = {
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier",
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
  rules: {},
  env: {
    browser: true,
  },
};

module.exports = eslintrc;

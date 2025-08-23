const eslintrc = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended",
    "prettier",
    "plugin:json/recommended",
    "plugin:cypress/recommended",
    "plugin:jest-dom/recommended",
    "plugin:jest/recommended",
    "plugin:jest/style",
    // "plugin:storybook/recommended" // 一時的に無効化
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    "@typescript-eslint",
    "react",
    "jest-dom",
    "testing-library",
    "jest",
  ],
  settings: {
    react: {
      version: "detect",
    },
    "import/core-modules": [
      "react",
      "react-dom",
      "react-router-dom",
      "config",
      "react-helmet",
    ],
  },
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "off", // 一時的に無効化
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-require-imports": "off",
    "react/prop-types": "off",
    "react/display-name": "off",
    "react/no-unknown-property": ["error", { ignore: ["fetchPriority"] }],
    "react/no-unescaped-entities": "off",
    "react/jsx-key": "warn",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    "jsx-a11y/no-noninteractive-element-interactions": "off",
    "jest/consistent-test-it": ["error", { fn: "it" }],
    "jest/require-top-level-describe": ["error"],
    "jest/no-commented-out-tests": "warn",
    "import/no-anonymous-default-export": "off",
  },
  env: {
    browser: true,
    node: true,
    es2020: true,
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

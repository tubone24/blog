export default {
  extends: [
    "stylelint-config-recommended-scss",
    "stylelint-config-standard",
    "@stylistic/stylelint-config",
    "stylelint-config-recess-order",
  ],
  plugins: ["stylelint-scss"],
  rules: {
    "at-rule-no-unknown": null,
    "scss/at-rule-no-unknown": true,
    "declaration-property-value-no-unknown": null,
    "nesting-selector-no-missing-scoping-root": null,
    "import-notation": "string",
  },
};

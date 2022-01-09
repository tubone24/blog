module.exports = {
  extends: [
    "stylelint-config-recommended-scss",
    "stylelint-config-standard",
    "stylelint-config-recess-order",
  ],
  plugins: ["stylelint-scss"],
  rules: {
    "at-rule-no-unknown": null,
    "scss/at-rule-no-unknown": true,
  },
};

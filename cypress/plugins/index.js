/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */

/* eslint-disable @typescript-eslint/no-var-requires */
const getCompareSnapshotsPlugin = require("cypress-visual-regression/dist/plugin");
const task = require("@cypress/code-coverage/task");
const browserifyIstanbul = require("@cypress/code-coverage/use-browserify-istanbul");

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  getCompareSnapshotsPlugin(on, config);
  task(on, config);
  on("file:preprocessor", browserifyIstanbul);
  return config;
};

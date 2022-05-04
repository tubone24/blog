/// <reference types="Cypress" />
/* eslint-disable jest/valid-expect */

const axeRunOptions = {
  rules: {
    "frame-title": { enabled: false },
  },
};

describe("UI Test", () => {
  it("about page with smooth scroll", () => {
    cy.visit("/");
    cy.contains("About").click();
    cy.location("href").should("include", "/about");
    cy.window().its("scrollY").should("equal", 0);
    cy.get("div > #toc_container > .toc_list > li").should(($lis) => {
      expect($lis, "toc list num").to.have.length(2);
      expect($lis.eq(0), "このブログについて").to.contain(
        "1 このブログについて"
      );
      expect($lis.eq(1), "WordCloud").to.contain("2 WordCloud");
    });
    cy.get("div > #toc_container > .toc_list > li:nth-child(1) > a").click();
    cy.location("href").should("include", "/about/#aboutblog");
    cy.window().its("scrollY").should("not.equal", 0);
    cy.get("[data-testid=GotoTopButton]").click();
    // Because of smooth scrolling
    // eslint-disable-next-line cypress/no-unnecessary-waiting,testing-library/await-async-utils
    cy.wait(5000);
    cy.window().its("scrollY").should("be.lt", 100);
  });
});
describe("a11y", () => {
  it("Has no detectable accessibility violations on TopPage", () => {
    cy.visit("/").injectAxe();
    cy.checkA11y(undefined, axeRunOptions);
  });
});

describe("404 Page", () => {
  it("Invalid Page returns 404 site", () => {
    cy.visit("/hogehogehogehogehoge", { failOnStatusCode: false }).injectAxe();
    cy.get("button").contains("Preview").click();
    cy.get("h1").contains("404 Not Found...");
    cy.get("h2").contains("Anything else...?");
  });
});

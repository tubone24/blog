/// <reference types="Cypress" />
/* eslint-disable jest/valid-expect */

const axeRunOptions = {
  rules: {
    "frame-title": { enabled: false },
  },
};

describe("UI Test", () => {
  it("about page smooth scroll", () => {
    cy.visit("/");
    cy.contains("About").click();
    cy.location("href").should("include", "/about");
    cy.window().its("scrollY").should("equal", 0);
    cy.get("div > #toc_container > .toc_list > li").should(($lis) => {
      expect($lis, "toc list num").to.have.length(4);
      expect($lis.eq(0), "経歴").to.contain("1 経歴");
      expect($lis.eq(1), "好きなこと").to.contain("2 好きなこと");
      expect($lis.eq(2), "このブログについて").to.contain(
        "3 このブログについて"
      );
      expect($lis.eq(3), "WordCloud").to.contain("4 WordCloud");
    });
    cy.get("div > #toc_container > .toc_list > li:nth-child(3) > a").click();
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

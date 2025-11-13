/// <reference types="Cypress" />
/* eslint-disable jest/valid-expect */

const axeRunOptions = {
  rules: {
    "frame-title": { enabled: false },
  },
};

describe("UI Test", () => {
  // eslint-disable-next-line jest/expect-expect
  it("tag page with jump", () => {
    cy.visit("/");
    cy.contains("Tags").click();
    cy.location("href").should("include", "/tags");
    cy.contains("test 1").click();
    cy.location("href").should("include", "/tag/test");
    cy.contains("このBlogテンプレートのテスト用投稿").click();
    cy.location("href").should("include", "/2011/08/30");
    cy.get("title").should(
      "have.text",
      "このBlogテンプレートのテスト用投稿 | tubone BOYAKI"
    );
    cy.get("[data-testid=share-box] [data-testid=GotoTopButton]").click();
    // Because of smooth scrolling
    // eslint-disable-next-line cypress/no-unnecessary-waiting,testing-library/await-async-utils
    cy.wait(5000);
    cy.window().its("scrollY").should("be.lt", 100);
  });
  // eslint-disable-next-line jest/expect-expect
  it("Logo click and return home", () => {
    cy.visit("/about");
    cy.get("[data-testid=logo-img]").click();
    cy.location("href").should("include", "/");
  });
  // eslint-disable-next-line jest/expect-expect
  it("Push subscription button", () => {
    cy.visit("/");
    cy.contains("SUBSCRIBE RSS").click();
    cy.location("href").should("include", "/rss.xml");
  });
});

describe("Privacy Policy Page", () => {
  // eslint-disable-next-line jest/expect-expect
  it("PrivacyPolicy", () => {
    cy.visit("/privacy-policies");
    cy.get("h1").contains("プライバシーポリシー");
  });
});

describe("404 Page", () => {
  // eslint-disable-next-line jest/expect-expect
  it("Invalid Page returns 404 site", () => {
    cy.visit("/hogehogehogehogehoge", { failOnStatusCode: false }).injectAxe();
    cy.get("button").contains("Preview").click();
    cy.get("h1").contains("404 Not Found...");
    cy.get("h2").contains("Anything else...?");
  });
});

describe("a11y", () => {
  // eslint-disable-next-line jest/expect-expect
  it("Has no detectable accessibility violations on TopPage", () => {
    cy.visit("/").injectAxe();
    // eslint-disable-next-line cypress/no-unnecessary-waiting,testing-library/await-async-utils
    cy.wait(5000);
    cy.checkA11y(undefined, axeRunOptions);
  });
});

describe("UI Test", () => {
  it("about page", () => {
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
    cy.wait(5000);
    cy.window().its("scrollY").should("be.lt", 100);
    cy.get("[data-testid=CommentButton]").click();
    cy.wait(5000);
    cy.window().its("scrollY").should("be.gt", 100);
  });
});

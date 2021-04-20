describe("UI Test", () => {
  it('compare ', () => {
    cy.visit('/');
    cy.wait(5000);
    cy.compareSnapshot('login', 0.0);
  });
});

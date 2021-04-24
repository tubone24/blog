describe("UI Test", () => {
  it('compare ', () => {
    cy.visit('/');
    cy.wait(5000);
    cy.compareSnapshot('top', {
      capture: 'fullPage',
      errorThreshold: 0.1
    });
  });
});

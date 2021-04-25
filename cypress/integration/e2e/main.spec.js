describe("UI Test", () => {
  it('compare toppage', () => {
    cy.visit('/');
    cy.wait(5000);
    cy.compareSnapshot('top', {
      capture: 'fullPage',
      errorThreshold: 0.1
    });
  });
  it('compare privacy policy', () => {
    cy.visit('/privacy-policies');
    cy.wait(5000);
    cy.compareSnapshot('privacy-policies', {
      capture: 'fullPage',
      errorThreshold: 0.1
    });
  });
});

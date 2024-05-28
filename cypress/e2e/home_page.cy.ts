describe("The Home Page", () => {
  it("successfully loads", () => {
    cy.visit("http://localhost:8081", {
      timeout: 120000,
    });
  });
});

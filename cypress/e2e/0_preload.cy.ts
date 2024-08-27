// this helps to get accurate test times by running first and preloading the app

describe("Preload", () => {
  it("successfully loads", () => {
    cy.visit("http://localhost:8081", {
      timeout: 300000,
    });
  });
});

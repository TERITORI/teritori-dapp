describe("Create a dao flow", () => {
  it("works", () => {
    cy.request("http://127.0.0.1:8888/reset");

    cy.visit("http://localhost:8081/orgs?network=gno-dev", {
      timeout: 300000,
    });

    cy.contains("Create Dao").click();
  });
});

describe("Create a dao flow", () => {
  it("works", () => {
    cy.request("http://127.0.0.1:8888/reset");

    cy.visit("http://localhost:8081/orgs?network=gno-dev", {
      timeout: 300000,
    });

    const daoName = "Test Dao";
    const handle = "testdao";
    const url = "https://images.unsplash.com/photo-1492571350019-22de08371fd3?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    const description = "Test Dao description";

    cy.contains("Create Dao").click();

    cy.get("input[placeholder='Type organization\\'s name here']").type(daoName);
    cy.get("input[placeholder='your_organization']").type(handle);
    cy.get("input[placeholder='https://example.com/preview.png']").type(url);
    //cy.type("input[placeholder='Type organization\\'s description here']").type(description); WHY IT DOES NOT WORK ??
  });
});

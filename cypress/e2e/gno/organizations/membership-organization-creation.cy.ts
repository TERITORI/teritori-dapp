import { connectWallet, resetChain } from "../lib";

describe("Create an organization flow", () => {
  it("works", () => {
    resetChain();

    cy.visit("http://localhost:8081/orgs?network=gno-dev", {
      timeout: 300000,
    });

    connectWallet();

    const daoName = "Test Dao";
    const handle = "testdao";
    const url =
      "https://images.unsplash.com/photo-1492571350019-22de08371fd3?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    const description = "Test Dao description";

    cy.contains("Create Dao").click();

    cy.get("input[placeholder='Type organization\\'s name here']").type(
      daoName,
    );
    cy.get("input[placeholder='your_organization']").type(handle);
    cy.get("input[placeholder='https://example.com/preview.png']").type(url);
    cy.get('[data-testid="organization-description"]').type(description);

    cy.contains("Next: Configure voting").click();
    cy.contains("Next: Set members").click();
    cy.get('[data-testid="member-settings-next"]').click();
    cy.contains("Confirm & Launch the Organization").click();

    cy.contains("Get Started", { timeout: 10000 }).should("exist");
  });
});

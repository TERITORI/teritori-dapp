import { changeTestUser, connectWallet, resetChain } from "./lib";

const showUppForm = () => {
  cy.contains("Edit profile").click();
  cy.get("div[data-testid='upp-form-btn-update-profile']", {
    timeout: 2000,
  }).should("exist");
};

const submitUppForm = () => {
  // Submit form and wait for form submitted
  cy.contains("Update profile").click();
  cy.get("div[data-testid='upp-form-btn-update-profile']", {
    timeout: 20000,
  }).should("not.exist");
};

describe("Edit UPP", () => {
  it("works", () => {
    const userAddress = "g1jy5qqwt4xg5hh467hlk5jw8m00u9e8tdes2qw8";
    const username = "yo1110";
    const displayName = "My Name";

    resetChain();

    cy.visit(`http://localhost:8081/user/gnodev-${userAddress}`, {
      timeout: 300_000,
    });

    connectWallet();
    changeTestUser("empty");

    // Register username --------------------------------------------------------------
    showUppForm();
    cy.get("input[placeholder='Type username here']").type(username);
    submitUppForm();

    // Verify if username is updated
    cy.get("div[data-testid=upp-username]").contains(`${username}.gno`);

    // Update display name --------------------------------------------------------
    showUppForm();
    cy.get("input[placeholder='Type display name here']").type(displayName);
    submitUppForm();

    // Verify if all data is updated
    cy.get("div[data-testid=upp-display-name]").contains(displayName);

    // Change display name, add bio --------------------------------------------------------
    showUppForm();
    cy.get("input[placeholder='Type display name here']").type(" updated");
    submitUppForm();

    // Verify if all data is updated
    cy.get("div[data-testid=upp-display-name]").contains(
      displayName + " updated",
    );
  });
});

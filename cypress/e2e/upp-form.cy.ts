import { changeTestUser } from "./lib";

const connectWallet = (userAddress: string, name: string) => {
  cy.visit(`http://localhost:8081/user/gnodev-${userAddress}?network=gno-dev`, {
    timeout: 300000,
  });

  cy.contains("Connect wallet").click({ force: true });
  cy.get("div[data-testid=connect-gnotest-wallet]").click({ force: true });
  cy.contains("Connect wallet").should("not.exist");
  changeTestUser(name);
};

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
    // Reset data each test
    cy.request("http://127.0.0.1:8888/reset");

    const userAddress = "g1jy5qqwt4xg5hh467hlk5jw8m00u9e8tdes2qw8";
    const username = "yo1110";
    const displayName = "My Name";

    connectWallet(userAddress, "empty");

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

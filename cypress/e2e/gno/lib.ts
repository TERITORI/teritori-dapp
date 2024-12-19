export const changeTestUser = (user: string) => {
  cy.window().then(async (win) => {
    const newUserId = await (win as any).adena.SetTestUser(user);
    cy.get(`*[data-testid='selected-wallet-${newUserId}']`).should("exist");
  });
};

export const changeSelectedMilestoneStatus = (newStatus: string) => {
  const getStatusDropdown = () =>
    cy.get("*[data-testid='milestone-select-new-status']", { timeout: 20000 });
  getStatusDropdown().click();
  const statusElem = getStatusDropdown().contains(newStatus);
  statusElem.click();
  statusElem.should("not.exist");
  cy.contains("Change Status").click();
};

export const resetChain = () => {
  cy.request("http://127.0.0.1:8888/reset");
};

export const connectWallet = () => {
  // NOTE: Wait a little bit to ensure that Connect wallet exist and clickable
  cy.wait(2000);

  cy.contains("Connect wallet").click({ force: true });

  cy.get("div[data-testid=connect-gnotest-wallet]", {
    timeout: 5_000,
  }).should('exist').click({ force: true });
  cy.contains("Connect wallet").should("not.exist");
};

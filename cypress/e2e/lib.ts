export const changeTestUser = (user: string) => {
  cy.window().then(async (win) => {
    const newUserId = await (win as any).adena.SetTestUser(user);
    cy.get(`*[data-testid='selected-wallet-${newUserId}']`).should("exist");
  });
};

export const changeSelectedMilestoneStatus = (newStatus: string) => {
  const getStatusDropdown = () =>
    cy.get("*[data-testid='milestone-select-new-status']");
  getStatusDropdown().click();
  const statusElem = getStatusDropdown().contains(newStatus);
  statusElem.click();
  statusElem.should("not.exist");
  cy.contains("Change Status").click();
};

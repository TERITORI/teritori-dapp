import { changeSelectedMilestoneStatus, changeTestUser } from "./lib";

describe("Contractor proposer full flow", () => {
  it("works", () => {
    cy.request("http://127.0.0.1:8888/reset");

    const projectName = "Test Project";
    const milestoneName = "Test Milestone";
    const judgeAddr = "g1nyz430dsujj56ygllcaujkzagz54v0l6yusspy";

    cy.visit("http://localhost:8081/projects?network=gno-dev", {
      timeout: 300000,
    });

    cy.contains("Create a Project").click();

    cy.contains("Connect wallet").click({ force: true });
    cy.get("div[data-testid=connect-gnotest-wallet]").click({ force: true });
    cy.contains("Connect wallet").should("not.exist");
    changeTestUser("bob");

    // first step: basic project info
    cy.get("input[placeholder='Your Grant name']").type(projectName);
    cy.get("textarea[placeholder='Your Grant description']").type(
      "Bli blu Bli blu Bli blu Bli blu Bli blu",
    );
    cy.get(
      "input[placeholder='Address of the authority that will resolve conflicts']",
    ).type(judgeAddr);

    cy.get("input[type=file]").selectFile("cypress/fixtures/image.png", {
      force: true,
    });
    cy.get("div[data-testid=loader-full-screen]", { timeout: 10000 }).should(
      "not.exist",
    );

    cy.get("input[placeholder='Add  1-5 main Grant tags using comma...']").type(
      "ui,ux,frontend",
    );
    cy.contains("Next").click();

    // second step: team info
    // TODO: remove the default values and type them here
    cy.contains("Next").click();

    // third step: add milestones
    cy.contains("Add").click();
    cy.get("input[placeholder='⚡️ Type name here...']").type("Test Milestone");
    cy.get("textarea[placeholder='Type description here...']").type(
      "Bli blu bla bleh",
    );
    cy.get("input[data-testid='milestone-budget']").clear().type("42");
    cy.get("input[data-testid='milestone-duration']").clear().type("3600");
    cy.get("div[data-testid='milestone-confirm']").click();
    cy.contains("Next").click();

    // fourth step: review and create
    cy.contains("Publish this request").click();
    cy.get("div[data-testid='confirm-and-sign']").click();
    cy.get("div[data-testid='confirm-and-sign']", { timeout: 20000 }).should(
      "not.exist",
    );
    cy.contains("Back to Project Program").click();

    // check that the project is present in manager as funder
    cy.contains("Projects Manager").click();
    cy.contains("My projects").click();
    cy.contains("Test Project").should("exist");
    cy.contains("Projects Program").click({ force: true });

    // make alice fund the project
    cy.contains(projectName).click();
    changeTestUser("alice");
    cy.contains("Fund this project").click();
    cy.get("div[data-testid='confirm-and-sign']").click();
    cy.get("div[data-testid='confirm-and-sign']", { timeout: 20000 }).should(
      "not.exist",
    );

    // switch to bob and do milestone
    changeTestUser("bob");
    cy.contains(milestoneName).click();
    // TODO: test in progress state
    changeSelectedMilestoneStatus("Review");

    // switch to alice and approve completion
    changeTestUser("alice");
    changeSelectedMilestoneStatus("Completed");

    cy.get("*[data-testid='project-status-COMPLETED']").should("exist");
  });
});

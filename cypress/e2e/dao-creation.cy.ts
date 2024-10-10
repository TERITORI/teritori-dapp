describe("Create a dao flow", () => {
  it("works", () => {
    cy.request("http://127.0.0.1:8888/reset");

    cy.visit("http://localhost:8081/orgs?network=gno-dev", {
      timeout: 300000,
    });

    const daoName = "Test Dao";
    const handle = "testdao";
    const url =
      "https://images.unsplash.com/photo-1492571350019-22de08371fd3?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    const description = "Test Dao description";
    const memberAddress = "g1nyz430dsujj56ygllcaujkzagz54v0l6yusspy";

    cy.contains("Create Dao").click();

    cy.get("input[placeholder='Type organization\\'s name here']").type(
      daoName,
    );
    cy.get("input[placeholder='your_organization']").type(handle);
    cy.get("input[placeholder='https://example.com/preview.png']").type(url);
    // because cy.get("input[placeholder='Type organization\\'s description here']").type(description) doesn't work, i use suggested selector from cypress studio
    cy.get(
      ":nth-child(5) > [style='flex-direction: row; width: 100%;'] > :nth-child(1) > [style='width: 100%;'] > .r-alignItems-1habvwh > .r-alignItems-1awozwy > .css-view-175oi2r > .css-textinput-11aywtz",
    ).type(description);

    cy.contains("Next: Configure voting").click();
    cy.contains("Next: Set tokens or members").click();

    cy.get(
      '.r-display-6koalj > :nth-child(1) > .r-WebkitOverflowScrolling-150rngu > .r-padding-1jgu3lx > .r-marginBottom-1ifxtd0 > .r-flex-6wfxan > :nth-child(1) > [style="flex-direction: row; width: 100%;"] > :nth-child(1) > [style="width: 100%;"] > .r-alignItems-1habvwh > .r-flexDirection-18u37iz > [style="flex: 1 1 0%; margin-right: 12px;"] > .css-textinput-11aywtz',
    ).type(memberAddress);

    cy.get(
      '.r-display-6koalj > :nth-child(1) > .r-alignItems-obd0qt > .r-cursor-1loqt21 > [style="height: 48px; opacity: 1;"] > [style="width: 100%; height: 100%; border-width: 1px; border-color: rgba(0, 0, 0, 0); padding: 0px 20px; align-items: center; justify-content: center;"]',
    ).click();
  });
});

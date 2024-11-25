import { defineConfig } from "cypress";

export default defineConfig({
  viewportWidth: 1900,
  viewportHeight: 1280,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

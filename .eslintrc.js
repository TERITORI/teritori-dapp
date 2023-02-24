module.exports = {
  root: true,
  extends: ["universe/native"],
  plugins: ["react-hooks"],
  rules: {
    "@typescript-eslint/no-unused-vars": "error",
    "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
    "react-hooks/exhaustive-deps": "error", // Checks effect dependencies
  },
  overrides: [
    {
      extends: "universe/node",
      files: [
        "babel.config.js",
        "electron-webpack.js",
        "metro.config.js",
        "electron/main/**",
        "packages/candymachine/**",
        "packages/scripts/**",
      ],
    },
  ],
  settings: {
    "import/ignore": ["react-native"],
  },
};

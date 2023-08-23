module.exports = {
  root: true,
  extends: ["universe/native"],
  plugins: ["react-hooks"],
  rules: {
    "@typescript-eslint/no-unused-vars": "error",
    "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
    "react-hooks/exhaustive-deps": "error", // Checks effect dependencies
    "prettier/prettier": "error",
    "import/order": "error",
  },
  overrides: [
    {
      extends: "universe/node",
      files: [
        ".eslintrc.js",
        "babel.config.js",
        "electron-webpack.js",
        "metro.config.js",
        "electron/main/**",
        "packages/scripts/**",
      ],
    },
  ],
};

module.exports = {
  root: true,
  extends: "universe/native",
  rules: {
    "@typescript-eslint/no-unused-vars": "error",
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
      ],
    },
  ],
};

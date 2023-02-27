module.exports = {
  root: true,
  extends: "universe/native",
  settings: {
    "import/ignore": ["react-native"],
  },
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
        "packages/scripts/**",
      ],
    },
  ],
};

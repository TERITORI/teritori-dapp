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
    "no-restricted-syntax": [
      "error",
      {
        message:
          "Do not use StyleSheet.create, it breaks type safety and allows for dead code.\nNo it's not faster, see https://stackoverflow.com/a/56219676\nIf you want to declare constant styles for memoized components, use something like `const myStyle: ViewStyle = { ... }`",
        selector:
          "MemberExpression[object.name='StyleSheet'][property.name='create']",
      },
      {
        message:
          "Do not use JSON.parse, it breaks type safety, use sanitization utils instead",
        selector: "MemberExpression[object.name='JSON'][property.name='parse']",
      },
    ],
  },
  overrides: [
    {
      extends: "universe/node",
      rules: {
        "@typescript-eslint/no-unused-vars": "error",
        "prettier/prettier": "error",
        "import/order": "error",
        "no-restricted-syntax": [
          "error",
          {
            message:
              "Do not use JSON.parse, it breaks type safety, use sanitization utils instead",
            selector:
              "MemberExpression[object.name='JSON'][property.name='parse']",
          },
        ],
      },
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

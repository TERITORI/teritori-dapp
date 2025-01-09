const disallowScreensImports = {
  group: ["@/screens/**", "../**/screens/**"],
  message: "Screens imports are only allowed in navigation and other screens.",
};

const disallowComponentsImports = {
  group: ["@/components/**", "../**/components/**"],
  message:
    "Components imports are only allowed in screens, contexts and other components.",
};

const disallowHooksImports = {
  group: ["@/hooks/**", "../**/hooks/**"],
  message:
    "Hooks imports are only allowed in screens, components, contexts and other hooks.",
};

const disallowContextImports = {
  group: ["@/context/**", "../**/context/**"],
  message:
    "Contexts imports are only allowed in screens, components, hooks and other contexts.",
};

const disallowScriptsImports = {
  group: ["@/scripts/**", "../**/scripts/**"],
  message: "Scripts imports are only allowed in scripts.",
};

const disallowStoreImports = {
  group: ["@/store/**", "../**/store/**"],
  message:
    "Store imports are only allowed in screens, components, hooks and itself",
};

module.exports = {
  root: true,
  extends: ["universe/native"],
  plugins: ["react-hooks"],
  rules: {
    "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
    "react-hooks/exhaustive-deps": "error", // Checks effect dependencies
    "@typescript-eslint/no-unused-vars": "error",
    "prettier/prettier": ["error", { proseWrap: "always" }],
    "import/order": "error",
    "@typescript-eslint/ban-ts-comment": [
      "error",
      { "ts-expect-error": "allow-with-description" },
    ],
    "no-fallthrough": "error",
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
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          disallowScreensImports,
          disallowComponentsImports,
          disallowHooksImports,
          disallowContextImports,
          disallowScriptsImports,
          disallowStoreImports,
        ],
      },
    ],
  },
  overrides: [
    // node scripts
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
    // override import rules
    {
      rules: {
        "no-restricted-imports": [
          "error",
          { patterns: [disallowScreensImports, disallowScriptsImports] },
        ],
      },
      files: ["packages/components/**"],
    },
    {
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              disallowComponentsImports,
              disallowScreensImports,
              disallowScriptsImports,
            ],
          },
        ],
      },
      files: ["packages/hooks/**"],
    },
    {
      rules: {
        "no-restricted-imports": [
          "error",
          { patterns: [disallowScreensImports, disallowScriptsImports] },
        ],
      },
      files: ["packages/context/**"],
    },
    {
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              disallowScreensImports,
              disallowComponentsImports,
              disallowHooksImports,
              disallowContextImports,
              disallowStoreImports,
            ],
          },
        ],
      },
      files: ["packages/scripts/**"],
    },
    {
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              disallowScreensImports,
              disallowComponentsImports,
              disallowHooksImports,
              disallowContextImports,
              disallowScriptsImports,
            ],
          },
        ],
      },
      files: ["packages/weshnet/**"],
    },
    {
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [disallowScriptsImports],
          },
        ],
      },
      files: ["packages/screens/**"],
    },
    {
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [disallowScriptsImports],
          },
        ],
      },
      files: ["packages/components/navigation/**"],
    },
    {
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [disallowScriptsImports],
          },
        ],
      },
      files: ["packages/dapp-root/**", "apps/**"],
    },
  ],
};

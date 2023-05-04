module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "@babel/plugin-proposal-numeric-separator",
      "inline-dotenv",
      [
        "react-native-reanimated/plugin",
        {
          relativeSourceLocation: true,
        },
      ],
    ],
  };
};

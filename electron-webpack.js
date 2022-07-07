const { withExpoAdapter } = require("@expo/electron-adapter");

module.exports = withExpoAdapter({
  projectRoot: __dirname,
  whiteListedModules: ["react-redux"], // see https://github.com/expo/expo-cli/issues/2835
});

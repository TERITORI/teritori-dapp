const { withExpoWebpack } = require("@expo/electron-adapter");
const Dotenv = require("dotenv-webpack");

module.exports = (oconfig) => {
  const config = withExpoWebpack(oconfig);

  // needed to use environment variables
  config.plugins.push(new Dotenv());

  return config;
};

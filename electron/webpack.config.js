const { withExpoWebpack } = require("@expo/electron-adapter");
const Dotenv = require("dotenv-webpack");

const svgRule = require("../svg-webpack-rule.js");

module.exports = (oconfig) => {
  const config = withExpoWebpack(oconfig);

  // needed to use environment variables
  config.plugins.push(new Dotenv());

  // we need to tell webpack to not handle svg with the url-loader rule
  config.module.rules = config.module.rules.map((rule) => {
    if (rule.test.source.includes("svg")) {
      return { ...rule, test: /\.(png|jpe?g|gif)(\?.*)?$/ };
    }
    return rule;
  });

  // then tell it to use svgr properly
  config.module.rules.unshift(svgRule);

  return config;
};

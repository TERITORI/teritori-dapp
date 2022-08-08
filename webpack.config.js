const createExpoWebpackConfigAsync = require("@expo/webpack-config");

const svgRule = require("./svg-webpack-rule.js");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // needed for svg loading in browser environment
  config.module.rules.forEach((rule) => {
    if (rule.oneOf) {
      rule.oneOf.unshift(svgRule);
    }
  });

  // needed by solana libs
  config.module.rules.unshift({
    type: "javascript/auto",
    test: /\.mjs$/,
    use: [],
  });

  return config;
};

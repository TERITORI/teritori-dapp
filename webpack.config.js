const createExpoWebpackConfigAsync = require("@expo/webpack-config");
const Dotenv = require("dotenv-webpack");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // needed to use environment variables
  config.plugins.push(new Dotenv());

  // victory native specific code
  config.module.rules.push({
    test: /.*victory-native\/.*\.js/,
    use: {
      loader: "babel-loader",
    },
  });

  // needed by solana libs
  config.module.rules.unshift({
    type: "javascript/auto",
    test: /\.mjs$/,
    use: [],
  });

  // resolve victory-native as victory for the Web app
  config.resolve.alias["victory-native"] = "victory";

  return config;
};

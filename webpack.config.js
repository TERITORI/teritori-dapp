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

  config.module.rules.push({
    test: /screenfull/,
    use: {
      loader: "babel-loader",
    },
  });

  config.module.rules.forEach((rule) => {
    if (rule.oneOf) {
      rule.oneOf.unshift({
        test: /\.svg$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve("@svgr/webpack"),
            options: {
              inlineStyles: {
                onlyMatchedOnce: false,
              },
              viewBox: false,
              removeUnknownsAndDefaults: false,
              convertColors: false,
            },
          },
        ],
      });
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

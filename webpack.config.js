const createExpoWebpackConfigAsync = require("@expo/webpack-config");
const Dotenv = require("dotenv-webpack");
const MomentLocalesPlugin = require("moment-locales-webpack-plugin");
// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { WebpackDeduplicationPlugin } = require("webpack-deduplication-plugin");
module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  if (process.env.isElectron) {
    config.target = "electron-renderer";
  }
  // needed to use environment variables
  config.plugins.push(
    new Dotenv(),
    new MomentLocalesPlugin(), // removes all locales except en-us
    // new BundleAnalyzerPlugin({
    //   path: "web-report",
    //   generateStatsFile: true,
    // }),
    new WebpackDeduplicationPlugin({
      cacheDir: "./cache",
    })
  );

  // victory native specific code
  config.module.rules.push({
    test: /.*victory-native[\\/].*\.js/,
    use: {
      loader: "babel-loader",
    },
  });

  // needed by gnolang
  config.module.rules.push({
    test: /.*@cosmjs[\\/]crypto[\\/]build[\\/]pbkdf2\.js/,
    use: {
      loader: "babel-loader",
      options: {
        sourceType: "unambiguous",
      },
    },
  });
  config.module.rules.push({
    test: /.*@cosmjs[\\/]amino[\\/]build[\\/]secp256k1hdwallet\.js/,
    use: {
      loader: "babel-loader",
      options: {
        sourceType: "unambiguous",
      },
    },
  });
  config.module.rules.push({
    test: /.*@cosmjs[\\/]utils[\\/]build[\\/]assert\.js/,
    use: {
      loader: "babel-loader",
      options: {
        sourceType: "unambiguous",
      },
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

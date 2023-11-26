const createExpoWebpackConfigAsync = require("@expo/webpack-config");
const Dotenv = require("dotenv-webpack");
const MomentLocalesPlugin = require("moment-locales-webpack-plugin");
const webpack = require("webpack");
// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { WebpackDeduplicationPlugin } = require("webpack-deduplication-plugin");
module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  if (process.env.isElectron) {
    config.target = "electron-renderer";
    config.output.publicPath = "./";
  }
  // since webpack5, node libs are not polyfilled automatically
  config.resolve.fallback = {
    ...config.resolve.fallback,
    assert: require.resolve("assert/"),
    crypto: require.resolve("crypto-browserify"),
    fs: false,
    os: require.resolve("os-browserify/browser"),
    stream: require.resolve("stream-browserify"),
  };
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  );

  config.plugins.push(
    new Dotenv({ ignoreStub: true }), // needed to use environment variables
    new MomentLocalesPlugin(), // removes all locales except en-us
    // new BundleAnalyzerPlugin({
    //   path: "web-report",
    //   generateStatsFile: true,
    // }),
    new WebpackDeduplicationPlugin({
      cacheDir: "./cache",
    }),
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

  config.module.rules = config.module.rules.map((rule) => {
    if (rule.oneOf instanceof Array) {
      rule.oneOf[rule.oneOf.length - 1].exclude = [
        /\.(js|mjs|jsx|cjs|ts|tsx)$/,
        /\.html$/,
        /\.json$/,
      ];
    }
    return rule;
  });

  // needed by solana libs
  config.module.rules.unshift({
    type: "javascript/auto",
    test: /\.mjs$/,
    use: [],
  });

  // Disable warnings because source maps spam warnings, see https://github.com/expo/expo/issues/21276#issuecomment-1445420455
  config.stats = "none";

  return config;
};

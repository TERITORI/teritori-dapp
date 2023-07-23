const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { resolver } = config;

  config.transformer = {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
  };
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg", "cjs"],
    blacklistRE: /redux-persist-electron-storage/,
    extraNodeModules: require("node-libs-react-native"),
  };

  config.server = {
    rewriteRequestUrl: (url) => {
      if (!url.endsWith(".bundle")) {
        return url;
      }
      // https://github.com/facebook/react-native/issues/36794
      // JavaScriptCore strips query strings, so try to re-add them with a best guess.
      return (
        url +
        "?platform=ios&dev=true&minify=false&modulesOnly=false&runModule=true"
      );
    }, // ...
  };

  return config;
})();

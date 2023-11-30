const { getDefaultConfig } = require("expo/metro-config");
const blacklist = require("metro-config/src/defaults/exclusionList");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
  };
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg", "cjs"],
    extraNodeModules: require("node-libs-react-native"),
    blacklistRE: blacklist([
      /node_modules\/redux-persist-electron-storage\/.*/,
      /node_modules\/electron\/.*/,
      /node_modules\/electron-store\/.*/,
    ]),
  };

  return config;
})();

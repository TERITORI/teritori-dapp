const { getDefaultConfig } = require("expo/metro-config");
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
    extraNodeModules: {
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
    },
  };

  config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (
      platform !== "web" &&
      [
        "redux-persist-electron-storage",
        "electron",
        "electron-store",
        "react-native-vision-camera",
      ].includes(moduleName)
    ) {
      return {
        type: "empty",
      };
    }
    if (
      platform === "web" &&
      ["react-native-fs", "@react-native-clipboard/clipboard"].includes(
        moduleName,
      )
    ) {
      return {
        type: "empty",
      };
    }
    //TODO: remove after electron renderer fix
    if (
      platform === "web" &&
      ["redux-persist-electron-storage", "electron", "electron-store"].includes(
        moduleName,
      ) &&
      process.env.isElectron
    ) {
      return {
        type: "empty",
      };
    }

    if (
      platform === "web" &&
      ["react-native-vision-camera"].includes(moduleName)
    ) {
      return {
        type: "empty",
      };
    }

    return context.resolveRequest(context, moduleName, platform);
  };
  return config;
})();

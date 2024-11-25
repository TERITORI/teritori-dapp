const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // monorepo config

  // Find the project and workspace directories
  const projectRoot = __dirname;
  // This can be replaced with `find-yarn-workspace-root`
  const monorepoRoot = path.resolve(projectRoot, "../..");

  // 1. Watch all files within the monorepo
  config.watchFolders = [monorepoRoot];
  // 2. Let Metro know where to resolve packages and in what order
  config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, "node_modules"),
    path.resolve(monorepoRoot, "node_modules"),
  ];

  // end monorepo config

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
  };
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg", "cjs"],
    /*
    extraNodeModules: {
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
    },
    */
  };

  config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (
      platform !== "web" &&
      ["redux-persist-electron-storage", "electron", "electron-store"].includes(
        moduleName,
      )
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

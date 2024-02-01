const config = {
  expo: {
    name: "Teritori",
    slug: "teritori",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    owner: "teritori",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#000000",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.teritori",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#FFFFFF",
      },
      package: "com.teritori",
    },
    web: {
      bundler: "metro",
      favicon: "./assets/favicon.png",
    },
    extra: {
      env: process.env,
      eas: {
        projectId: "9ce165de-0199-478c-b3bd-8688e5ce03eb",
      },
    },
    plugins: ["expo-font"],
  },
};

export default config;

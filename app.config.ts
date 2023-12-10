import { ExpoConfig } from "expo/config";

const config: { expo: ExpoConfig } = {
  expo: {
    name: "Teritori",
    slug: "teritori-dapp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
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
      bundleIdentifier: "com.teritori.dapp",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#FFFFFF",
      },
      package: "com.teritori",
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "webpack",
    },
    extra: {
      env: process.env,
    },
  },
};

export default config;

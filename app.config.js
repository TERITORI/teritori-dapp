const config = {
  expo: {
    name: "Teritori",
    slug: "teritori",
    version: "1.0.3",
    orientation: "portrait",
    icon: "./assets/app-icon.png",
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
      buildNumber: "5",
      infoPlist: {
        NSBluetoothAlwaysUsageDescription: "Used for Bluetooth communications",
        NSBluetoothPeripheralUsageDescription:
          "Used for Bluetooth communications",
        NSPhotoLibraryUsageDescription:
          "Access to your photo library is required for image upload functionality.",
        ITSAppUsesNonExemptEncryption: false,
        NSPrivacyAccessedAPICategoryDiskSpace:
          "To efficiently manage local storage and cache files for improved app performance.",
        NSPrivacyAccessedAPICategoryFileTimestamp:
          "To track file modification dates for app data synchronization and integrity checks.",
        NSPrivacyAccessedAPICategoryUserDefaults:
          "To store user preferences and settings locally for a customized user experience.",
        NSPrivacyAccessedAPICategorySystemBootTime:
          "To optimize app launch times and resource utilization based on system boot information.",
        UIBackgroundModes: ["audio"],
      },
    },
    android: {
      package: "com.teritori",
      versionCode: "6",
      permissions: ["WAKE_LOCK"],
    },
    web: {
      bundler: "metro",
      favicon: "./assets/favicon.png",
    },
    extra: {
      eas: {
        projectId: "9ce165de-0199-478c-b3bd-8688e5ce03eb",
      },
    },
    plugins: [
      "expo-font",
      [
        "expo-document-picker",
        {
          iCloudContainerEnvironment: "Production",
        },
      ],
      [
        "react-native-vision-camera",
        {
          cameraPermissionText: "$(PRODUCT_NAME) needs access to your Camera.",
        },
      ],
    ],
  },
};

export default config;

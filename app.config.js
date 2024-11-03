const config = {
  expo: {
    scheme: "teritori",
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
        UIBackgroundModes: ["audio"],
      },
      // associatedDomains: ["applinks:app.teritori.com"], FIXME: when adding this ios is not build but it is needed for deep linking
    },
    android: {
      package: "com.teritori",
      versionCode: "6",
      permissions: [
        "WAKE_LOCK",
        "BLUETOOTH",
        "BLUETOOTH_ADMIN",
        "BLUETOOTH_ADVERTISE",
        "BLUETOOTH_SCAN",
        "BLUETOOTH_CONNECT",
        "ACCESS_NETWORK_STATE",
        "CHANGE_NETWORK_STATE",
        "CHANGE_WIFI_STATE",
        "ACCESS_WIFI_STATE",
        "CHANGE_WIFI_MULTICAST_STATE",
        "NFC",
      ],
      scheme: "teritori",
      intentFilters: [
        {
          action: "VIEW",
          autoVerify: true,
          data: [
            {
              scheme: "https",
              host: "app.teritori.com",
              pathPrefix: "/",
            },
          ],
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],
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
          enableCodeScanner: true,
        },
      ],
    ],
  },
};

export default config;

import Constants from "expo-constants";

import "@expo/metro-runtime";

Object.entries(Constants.expoConfig?.extra?.env).forEach(([key, value]) => {
  process.env[key] = `${value}`;
});

import { Buffer as BufferImport } from "buffer";
import Constants from "expo-constants";

import "@expo/metro-runtime";
import Root from "./Root";

if (!globalThis.Buffer) {
  globalThis.Buffer = BufferImport;
}

Object.entries(Constants.expoConfig?.extra?.env).forEach(([key, value]) => {
  process.env[key] = `${value}`;
});

export default Root;

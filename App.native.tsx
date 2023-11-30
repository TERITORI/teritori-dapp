import { grpc } from "@improbable-eng/grpc-web";
import { ReactNativeTransport } from "@improbable-eng/grpc-web-react-native-transport";
import "node-libs-react-native/globals";
import "@react-native-anywhere/polyfill-base64";
import "text-encoding-polyfill";
import "react-native-url-polyfill/auto";
import "react-native-get-random-values";
import "react-native-gesture-handler";
import Constants from "expo-constants";

import Root from "./Root";

Object.entries(Constants.expoConfig?.extra?.env).forEach(([key, value]) => {
  process.env[key] = `${value}`;
});

grpc.setDefaultTransport(ReactNativeTransport({}));
export default Root;

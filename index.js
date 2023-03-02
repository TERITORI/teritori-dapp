import { registerRootComponent } from "expo";
import React from "react";
import { AppRegistry, View, LogBox } from "react-native";
import "@react-native-anywhere/polyfill-base64";
import "react-native-gesture-handler";

import App from "./App";

function Root() {
  return <App />;
}

registerRootComponent(Root);

AppRegistry.registerComponent("main", () => Root);

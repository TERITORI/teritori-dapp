import { registerRootComponent } from "expo";
import React from "react";
import { AppRegistry } from "react-native";

import "@react-native-anywhere/polyfill-base64";
import "react-native-gesture-handler";
import "text-encoding-polyfill";
import "react-native-get-random-values";
import App from "./App";

function Root() {
  return <App />;
}

registerRootComponent(Root);

AppRegistry.registerComponent("main", () => Root);

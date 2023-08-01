import React from "react";
import { Image, View } from "react-native";

import { SVG } from "./SVG";
import { getNetwork } from "../networks";

export const NetworkIcon: React.FC<{
  networkId: string | undefined;
  size: number;
}> = ({ networkId, size }) => {
  const network = getNetwork(networkId);
  const iconToUse = network?.icon;
  if (!iconToUse || iconToUse === "not-found") {
    return <View style={{ height: size, width: size }} />;
  }
  const source = iconToUse.startsWith("http")
    ? iconToUse
    : require("../../assets/" + iconToUse).default;
  if (!iconToUse.startsWith("http") && iconToUse.endsWith(".svg")) {
    return <SVG source={source} width={size} height={size} />;
  }
  return (
    <Image source={{ uri: source }} style={{ width: size, height: size }} />
  );
};

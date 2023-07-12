import React from "react";
import { Image } from "react-native";

import { SVG } from "./SVG";
import { getNetwork } from "../networks";

export const NetworkIcon: React.FC<{
  networkId: string | undefined;
  size: number;
}> = ({ networkId, size }) => {
  const network = getNetwork(networkId);
  if (!network?.icon) {
    return null;
  }
  const source = require("../../assets/" + network.icon).default;
  if (network.icon.endsWith(".svg")) {
    return <SVG source={source} width={size} height={size} />;
  }
  return (
    <Image source={{ uri: source }} style={{ width: size, height: size }} />
  );
};

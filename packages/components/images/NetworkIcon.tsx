import React from "react";
import { Image } from "react-native";

import { getNetwork } from "../../networks";
import { SVG } from "../SVG";

export const NetworkIcon: React.FC<{
  networkId: string;
  size: number;
  circle?: boolean;
}> = ({ networkId, size, circle }) => {
  const network = getNetwork(networkId);
  const networkIcon = circle ? network?.iconCircle : network?.icon;
  if (!networkIcon) {
    return null;
  }
  const source = require("../../assets/" + networkIcon).default;
  if (networkIcon.endsWith(".svg")) {
    return <SVG source={source} width={size} height={size} />;
  }
  return (
    <Image source={{ uri: source }} style={{ width: size, height: size }} />
  );
};

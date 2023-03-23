import React from "react";

import { getNetwork } from "../networks";
import { SVG } from "./SVG";

export const NetworkIcon: React.FC<{
  networkId: string;
  size: number;
}> = ({ networkId, size }) => {
  const network = getNetwork(networkId);
  if (!network?.icon) {
    return null;
  }

  return <SVG source={network.icon} width={size} height={size} />;
};

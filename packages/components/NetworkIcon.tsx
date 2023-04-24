import { startCase, camelCase } from "lodash";
import React from "react";

import { SVG } from "./SVG";
import { icons } from "../../assets";
import { getNetwork } from "../networks";

export const NetworkIcon: React.FC<{
  networkId: string | undefined;
  size: number;
}> = ({ networkId, size }) => {
  const network = getNetwork(networkId);
  if (!network?.icon) {
    return null;
  }

  const source =
    //@ts-ignore
    icons.networks[
      camelCase(network.icon.replace(".svg", "")).replace(/ /g, "")
    ];
  if (!source) {
    return null;
  }

  return <SVG source={source} width={size} height={size} />;
};

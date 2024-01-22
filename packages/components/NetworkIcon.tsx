import { camelCase } from "lodash";
import React from "react";
import { View } from "react-native";

import { SVG } from "./SVG";
import { icons } from "../../assets";
import { getNetwork } from "../networks";
import { neutral77 } from "../utils/style/colors";
export const NetworkIcon: React.FC<{
  networkId: string | undefined;
  size: number;
}> = ({ networkId, size }) => {
  const network = getNetwork(networkId);
  const iconToUse = network?.icon;
  if (!iconToUse || iconToUse === "not-found") {
    return (
      <View
        style={{
          height: size,
          width: size,
          backgroundColor: neutral77,
          borderRadius: size / 4,
        }}
      />
    );
  }

  return (
    <SVG
      style={{ borderRadius: size / 4 }}
      source={
        iconToUse.startsWith("http")
          ? iconToUse
          : icons.networks[
              camelCase(iconToUse.replace(".svg", "")).replace(
                / /g,
                "",
              ) as keyof typeof icons.networks
            ]
      }
      width={size}
      height={size}
    />
  );
};

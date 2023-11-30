import { camelCase } from "lodash";
import React from "react";
import { Image, View } from "react-native";

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

  if (iconToUse.endsWith(".svg")) {
    return (
      <SVG
        style={{ borderRadius: size / 4 }}
        source={
          icons.networks[
            camelCase(iconToUse.replace(".svg", "")).replace(
              / /g,
              "",
            ) as keyof typeof icons.networks
          ] || iconToUse
        }
        width={size}
        height={size}
      />
    );
  }

  return (
    <Image
      source={{ uri: iconToUse }}
      style={{ width: size, height: size, borderRadius: size / 4 }}
    />
  );
};

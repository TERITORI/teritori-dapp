import { startCase, camelCase } from "lodash";
import React from "react";
<<<<<<< HEAD
import { Image, View } from "react-native";
=======
>>>>>>> 9a0880e1 (mobile & desktop build)

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
<<<<<<< HEAD
  const source = iconToUse.startsWith("http")
    ? iconToUse
    : require("../../assets/" + iconToUse).default;
  if (!iconToUse.startsWith("http") && iconToUse.endsWith(".svg")) {
    return (
      <SVG
        style={{ borderRadius: size / 4 }}
        source={source}
        width={size}
        height={size}
      />
    );
  }
  return (
    <Image
      source={{ uri: source }}
      style={{ width: size, height: size, borderRadius: size / 4 }}
    />
  );
=======

  const source =
    //@ts-ignore
    icons.networks[
      camelCase(network.icon.replace(".svg", "")).replace(/ /g, "")
    ];
  if (!source) {
    return null;
  }

  return <SVG source={source} width={size} height={size} />;
>>>>>>> 9a0880e1 (mobile & desktop build)
};

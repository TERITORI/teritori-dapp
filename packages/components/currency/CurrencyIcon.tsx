import { camelCase } from "lodash";
import React from "react";
import { Image, View } from "react-native";

import { getNativeCurrency } from "../../networks";
import { neutral77 } from "../../utils/style/colors";
import { SVG } from "../SVG";

import { icons } from "@/assets/index";
export const CurrencyIcon: React.FC<{
  networkId: string;
  denom: string;
  size: number;
  icon?: string;
}> = ({ networkId, denom, size, icon }) => {
  const currency = getNativeCurrency(networkId, denom);
  const iconToUse = currency?.icon ? currency.icon : icon;
  if (!iconToUse)
    return (
      <View
        style={{
          height: size,
          width: size,
          backgroundColor: neutral77,
          borderRadius: size / 2,
        }}
      />
    );

  if (iconToUse.endsWith(".svg")) {
    return (
      <SVG
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
        style={{ borderRadius: size / 2 }}
      />
    );
  }
  return (
    <Image
      source={{ uri: iconToUse }}
      style={{ width: size, height: size, borderRadius: size / 2 }}
    /> // this might be broken on mobile with svgs
  );
};

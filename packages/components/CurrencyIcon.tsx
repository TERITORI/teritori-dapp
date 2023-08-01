import React from "react";
import { Image, View } from "react-native";

import { SVG } from "./SVG";
import { getNativeCurrency } from "../networks";

export const CurrencyIcon: React.FC<{
  networkId: string;
  denom: string;
  size: number;
  icon?: string;
}> = ({ networkId, denom, size, icon }) => {
  const currency = getNativeCurrency(networkId, denom);
  const iconToUse = currency?.icon ? currency.icon : icon;
  if (!iconToUse) return <View style={{ height: size, width: size }} />;

  const source = iconToUse.startsWith("http")
    ? iconToUse
    : require("../../assets/" + iconToUse).default;
  if (!iconToUse.startsWith("http") && iconToUse.endsWith(".svg")) {
    return <SVG source={source} width={size} height={size} />;
  }
  return (
    <Image source={{ uri: source }} style={{ width: size, height: size }} /> // this might be broken on mobile with svgs
  );
};

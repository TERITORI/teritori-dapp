import React from "react";
import { Image } from "react-native";

import { getNativeCurrency } from "../../networks";
import { SVG } from "../SVG";

export const CurrencyIcon: React.FC<{
  icon?: string;
  networkId: string;
  denom: string;
  size: number;
}> = ({ icon, networkId, denom, size }) => {
  const currency = getNativeCurrency(networkId, denom);
  const iconToUse = currency?.icon ? currency.icon : icon;
  if (!iconToUse) return null;

  const source = require("../../../assets/" + iconToUse).default;
  if (iconToUse.endsWith(".svg")) {
    return <SVG source={source} width={size} height={size} />;
  }
  return (
    <Image source={{ uri: source }} style={{ width: size, height: size }} />
  );
};

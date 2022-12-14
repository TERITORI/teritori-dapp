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
  if (!currency?.icon) {
    return null;
  }
  const source = require("../../../assets/" +
    (icon ? icon : currency.icon)).default;
  if (currency.icon.endsWith(".svg")) {
    return <SVG source={source} width={size} height={size} />;
  }
  return (
    <Image source={{ uri: source }} style={{ width: size, height: size }} />
  );
};

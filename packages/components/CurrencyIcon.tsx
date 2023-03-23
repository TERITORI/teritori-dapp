import React from "react";
import { Image } from "react-native";

import { SVG } from "./SVG";
import { getNativeCurrency } from "../networks";

export const CurrencyIcon: React.FC<{
  networkId: string;
  denom: string;
  size: number;
}> = ({ networkId, denom, size }) => {
  const currency = getNativeCurrency(networkId, denom);
  if (!currency?.icon) {
    return null;
  }
  const source = require("../../assets/" + currency.icon).default;
  if (currency.icon.endsWith(".svg")) {
    return <SVG source={source} width={size} height={size} />;
  }
  return (
    <Image source={{ uri: source }} style={{ width: size, height: size }} />
  );
};

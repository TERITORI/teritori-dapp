import React from "react";

import { getNativeCurrency } from "../networks";
import { SVG } from "./SVG";

export const CurrencyIcon: React.FC<{
  networkId: string;
  denom: string;
  size: number;
}> = ({ networkId, denom, size }) => {
  const currency = getNativeCurrency(networkId, denom);
  if (!currency?.icon) {
    return null;
  }

  return <SVG source={currency.icon} width={size} height={size} />;
};

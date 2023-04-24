import { camelCase } from "lodash";
import React from "react";

import { SVG } from "./SVG";
import { icons } from "../../assets";
import { getNativeCurrency } from "../networks";

export const CurrencyIcon: React.FC<{
  networkId: string;
  denom: string;
  size: number;
  icon?: string;
}> = ({ networkId, denom, size, icon }) => {
  const currency = getNativeCurrency(networkId, denom);
  const iconToUse = currency?.icon ? currency.icon : icon;
  if (!iconToUse) return null;

  const source =
    //@ts-ignore
    icons.networks[camelCase(iconToUse.replace(".svg", "")).replace(/ /g, "")];
  if (!source) {
    return null;
  }

  return <SVG source={source} width={size} height={size} />;
};

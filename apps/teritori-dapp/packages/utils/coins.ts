import { Decimal } from "@cosmjs/math";

import { prettyNumber } from "./numbers";
import { getNativeCurrency } from "../networks";

export interface Balance {
  amount: string;
  usdAmount?: number;
  denom: string;
}

export const decimalFromAtomics = (
  networkId: string | undefined,
  value: string,
  denom: string,
) => {
  const currency = getNativeCurrency(networkId, denom);
  if (currency) {
    return Decimal.fromAtomics(value, currency.decimals);
  }
  return Decimal.fromAtomics("0", 0);
};

// FIXME: rename to prettyAmount

// Returns the price with denom (Text + denom)
export const prettyPrice = (
  networkId: string | undefined,
  value: string | undefined,
  denom: string | undefined,
  noDenom?: boolean,
) => {
  if (!value) {
    value = "0";
  }
  if (!denom) {
    denom = "unknown";
  }

  // PATCH/HACK: sometime, the original value is corrupted. Ex: 1.0000000200408773e+21
  // To avoid crash, we handle that case here. Ofc, fixing it at source of data would be better
  if (value.includes("e+")) {
    value = bigNumToStr(Number(value));
  }

  const currency = getNativeCurrency(networkId, denom);
  if (currency) {
    const decval = Decimal.fromAtomics(value || "0", currency.decimals);
    if (
      !decval.isGreaterThanOrEqual(
        Decimal.fromUserInput("10", currency.decimals),
      )
    ) {
      if (noDenom) return `${decval.toString()}`;
      return `${decval.toString()} ${currency.displayName}`;
    }
    const val = decval.toFloatApproximation();
    const text = prettyNumber(val, 2);
    if (noDenom) return text;
    return `${text} ${currency.displayName}`;
  }
  if (noDenom) return `${value}`;
  return `${value} ${denom}`;
};

// Src: https://stackoverflow.com/questions/1685680/how-to-avoid-scientific-notation-for-large-numbers-in-javascript
const bigNumToStr = (myNumb: number | string) => {
  return Number(myNumb).toLocaleString("fullwide", { useGrouping: false });
};

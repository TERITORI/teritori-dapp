import { Decimal } from "@cosmjs/math";

import { trimFixed } from "./numbers";
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

const units = ["", "K", "M", "B", "T", "P", "E", "Z", "Y"];

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
    let val = decval.toFloatApproximation();
    let unitIndex = 0;
    while (val >= 1000 && unitIndex !== units.length - 1) {
      val /= 1000;
      unitIndex++;
    }
    if (noDenom) return `${trimFixed(val.toFixed(2))}${units[unitIndex]}`;
    return `${trimFixed(val.toFixed(2))}${units[unitIndex]} ${
      currency.displayName
    }`;
  }
  if (noDenom) return `${value}`;
  return `${value} ${denom}`;
};

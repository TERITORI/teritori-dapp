import { Decimal } from "cosmwasm";

import { getNativeCurrency } from "../networks";
import { toriCurrency } from "./teritori";

export interface Balance {
  amount: string;
  usdAmount?: number;
  denom: string;
}

const currencies = [toriCurrency];

export const decimalFromAtomics = (value: string, denom: string) => {
  const currency = currencies.find(
    (currency) => currency.coinMinimalDenom === denom
  );
  if (currency) {
    return Decimal.fromAtomics(value, currency.coinDecimals);
  }
  throw new Error("unknown denom");
};

// Returns the price with denom (Text + denom)
export const prettyPrice = (
  networkId: string,
  value: string,
  denom: string
) => {
  const currency = getNativeCurrency(networkId, denom);
  if (currency) {
    return `${Decimal.fromAtomics(value, currency.decimals)} ${
      currency.displayName
    }`;
  }
  return `${value} ${denom}`;
};

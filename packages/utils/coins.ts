import { Decimal } from "cosmwasm";

import { getNativeCurrency } from "../networks";

export interface Balance {
  amount: string;
  usdAmount?: number;
  denom: string;
}

export const decimalFromAtomics = (value: string, denom: string) => {
  const currency = getNativeCurrency(process.env.TERITORI_NETWORK_ID, denom);
  if (currency) {
    return Decimal.fromAtomics(value, currency.decimals);
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

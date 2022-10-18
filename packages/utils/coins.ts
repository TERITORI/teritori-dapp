import { Decimal } from "cosmwasm";

import { toriCurrency } from "./teritori";

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
export const prettyPrice = (value: string, denom: string) => {
  const currency = currencies.find(
    (currency) => currency.coinMinimalDenom === denom
  );
  if (currency) {
    return `${Decimal.fromAtomics(value, currency.coinDecimals)} ${
      currency.coinDenom
    }`;
  }
  return `${value} ${denom}`;
};

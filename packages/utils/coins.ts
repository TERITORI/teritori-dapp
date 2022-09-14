import { Decimal } from "cosmwasm";

import { toriCurrency } from "./teritori";

const currencies = [toriCurrency];

export const decimalPrice = (value: string, denom: string) => {
  const currency = currencies.find(
    (currency) => currency.coinMinimalDenom === denom
  );
  if (currency) {
    return Decimal.fromAtomics(value, currency.coinDecimals);
  }
  return value;
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

import { Decimal } from "cosmwasm";

import { toriCurrency } from "./teritori";

const currencies = [toriCurrency];

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

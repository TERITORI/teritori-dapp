import { Decimal } from "cosmwasm";

import { getNativeCurrency, getNetwork } from "../networks";
import { WEI_TOKEN_ADDRESS } from "./ethereum";
import { Network } from "./network";
import { trimFixed } from "./numbers";

export interface Balance {
  amount: string;
  usdAmount?: number;
  denom: string;
}

export const decimalFromAtomics = (
  networkId: string,
  value: string,
  denom: string
) => {
  const currency = getNativeCurrency(networkId, denom);
  if (currency) {
    return Decimal.fromAtomics(value, currency.decimals);
  }
  throw new Error("unknown denom");
};

const units = ["", "K", "M", "G", "T", "P", "E", "Z", "Y"];

// Returns the price with denom (Text + denom)
export const prettyPrice = (
  networkId: string,
  value: string,
  denom: string
) => {
  const network = getNetwork(networkId);
  if (network?.network === Network.Ethereum && denom === WEI_TOKEN_ADDRESS) {
    denom = "wei";
  }

  const currency = getNativeCurrency(networkId, denom);
  if (currency) {
    const decval = Decimal.fromAtomics(value, currency.decimals);
    if (
      !decval.isGreaterThanOrEqual(
        Decimal.fromUserInput("10", currency.decimals)
      )
    ) {
      return `${decval.toString()} ${currency.displayName}`;
    }
    let val = decval.toFloatApproximation();
    let unitIndex = 0;
    while (val >= 1000 && unitIndex !== units.length - 1) {
      val /= 1000;
      unitIndex++;
    }
    return `${trimFixed(val.toFixed(2))}${units[unitIndex]} ${
      currency.displayName
    }`;
  }
  return `${value} ${denom}`;
};

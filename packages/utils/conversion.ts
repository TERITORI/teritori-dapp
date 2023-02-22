import { bech32 } from "bech32";

const DENOM = process.env.PUBLIC_CHAIN_BECH32_PREFIX || "tori";

export const getDenom = () => DENOM.toLowerCase();

export const getTeritoriAddress = (cosmosAddress: string) =>
  bech32.encode(getDenom(), bech32.decode(cosmosAddress).words);

export function convertMicroDenomToDenom(amount: number | string) {
  if (typeof amount === "string") {
    amount = Number(amount);
  }
  amount = amount / 1000000;
  return isNaN(amount) ? 0 : amount;
}

export function convertDenomToMicroDenom(amount: number | string): string {
  if (typeof amount === "string") {
    amount = Number(amount);
  }
  amount = amount * 1000000;
  return isNaN(amount) ? "0" : String(amount);
}

export function convertFromMicroDenom(denom: string) {
  return denom.substring(1).toUpperCase();
}

export function convertToFixedDecimals(amount: number | string): string {
  if (typeof amount === "string") {
    amount = Number(amount);
  }
  if (amount > 0.01) {
    return amount.toFixed(2);
  } else return String(amount);
}

export const zeroStakingCoin = {
  amount: "0",
  denom: process.env.PUBLIC_STAKING_DENOM || "utori",
};

export function convertDenomToHumanReadableDenom(denom: string): string {
  if (denom.startsWith("u")) {
    return denom.substring(1);
  }
  return denom;
}

export function convertDenomToContractReadableDenom(denom: string): string {
  if (denom.startsWith("u")) {
    return denom;
  }
  return "u" + denom;
}

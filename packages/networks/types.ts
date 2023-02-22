import { Network } from "./../utils/network";
export interface NetworkInfo {
  id: string;
  network: Network;
  chainId: string;
  displayName: string;
  currencies: CurrencyInfo[];
  icon?: string;
  walletUrlForStaking?: string;
  addressPrefix: string;
  restEndpoint: string;
  rpcEndpoint: string;
  stakeCurrency: string;
  gasPriceStep: {
    low: number;
    average: number;
    high: number;
  };
  features: string[];
}

export type CurrencyKind = "native" | "ibc";

export type NativeCurrencyInfo = {
  kind: "native";
  denom: string;
  displayName: string;
  decimals: number;
  coingeckoId: string;
  icon: string;
  color: string;
};

export type IBCCurrencyInfo = {
  kind: "ibc";
  denom: string;
  sourceNetwork: string;
  sourceDenom: string;
  sourceChannelPort: string;
  sourceChannelId: string;
  destinationChannelPort: string;
  destinationChannelId: string;
  deprecated?: boolean;
};

export type CurrencyInfo = NativeCurrencyInfo | IBCCurrencyInfo;

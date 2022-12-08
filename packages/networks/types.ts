import { NetworkName } from "./NetworkName";

export interface NetworkInfo {
  id: string;
  chainId: string;
  displayName: NetworkName;
  currencies: CurrencyInfo[];
  icon?: string;
  iconCircle?: string;
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
  disabled?: boolean;
  hidden?: boolean;
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

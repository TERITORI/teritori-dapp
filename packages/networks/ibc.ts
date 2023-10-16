// we need to export this here to prevent a cyclic dependency
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

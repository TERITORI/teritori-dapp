import { NetworkName } from "../NetworkName";
import { allNativeCurrencies } from "../allNativeCurrencies";
import { CurrencyInfo } from "../types";

export const teritoriTestnetCurrencies: CurrencyInfo[] = [
  allNativeCurrencies.find(
    (nativeCurrencyInfo) =>
      nativeCurrencyInfo.sourceNetworkDisplayName ===
      NetworkName.TeritoriTestnet
  ) as CurrencyInfo,
  {
    kind: "ibc",
    denom:
      "ibc/C9300DDD93DF3A3A668CAB02398A0AA081EF89EC005B2DB68832E363BAAABF85",
    displayName: "ATOM",
    sourceNetwork: "cosmos-hub-theta",
    sourceNetworkDisplayName: NetworkName.CosmosHubTheta,
    sourceDenom: "uatom",
    sourceChannelPort: "transfer",
    sourceChannelId: "channel-685",
    destinationChannelPort: "transfer",
    destinationChannelId: "channel-30",
    icon: "icons/networks/cosmos-hub-circle.svg",
    deprecated: true,
  },
  {
    kind: "ibc",
    denom:
      "ibc/8D9734B53D56DC57A92E4CC788547699853F411190F6DAA70FA12B9BD062F7AE",
    displayName: "ATOM",
    sourceNetwork: "cosmos-hub-theta",
    sourceNetworkDisplayName: NetworkName.CosmosHubTheta,
    sourceDenom: "uatom",
    sourceChannelPort: "transfer",
    sourceChannelId: "channel-701",
    destinationChannelPort: "transfer",
    destinationChannelId: "channel-33",
    icon: "icons/networks/cosmos-hub-circle.svg",
  },

  //TODO: ibc for osmosis-testnet
];

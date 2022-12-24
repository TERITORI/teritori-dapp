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
      "ibc/8D9734B53D56DC57A92E4CC788547699853F411190F6DAA70FA12B9BD062F7AE",
    displayName: "ATOM",
    sourceNetwork: "cosmos-hub-testnet",
    sourceNetworkDisplayName: NetworkName.CosmosHubTheta,
    sourceDenom: "uatom",
    sourceChannelPort: "transfer",
    sourceChannelId: "channel-701",
    destinationChannelPort: "transfer",
    destinationChannelId: "channel-33",
    icon: "icons/networks/cosmos-hub-circle.svg",
  },
  {
    kind: "ibc",
    denom:
      "",
    displayName: "OSMO",
    sourceNetwork: "osmosis-testnet",
    sourceNetworkDisplayName: NetworkName.OsmosisTestnet,
    sourceDenom: "uosmo",
    sourceChannelPort: "transfer",
    sourceChannelId: "channel-34",
    destinationChannelPort: "transfer",
    destinationChannelId: "channel-1810",
    icon: "icons/networks/osmosis-circle.svg",
  },
  // Only Juno mainnet (juno-1)
  {
    kind: "ibc",
    denom:
      "",
    displayName: "JUNO",
    sourceNetwork: "juno",
    sourceNetworkDisplayName: NetworkName.Juno,
    sourceDenom: "ujuno",
    sourceChannelPort: "transfer",
    sourceChannelId: "channel-164",
    destinationChannelPort: "transfer",
    destinationChannelId: "channel-11",
    icon: "icons/networks/juno-circle.svg",
  },
];

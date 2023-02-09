import { NetworkName } from "../NetworkName";
import { allNativeCurrencies } from "../allNativeCurrencies";
import { CurrencyInfo } from "../types";

export const osmosisTestnetCurrencies: CurrencyInfo[] = [
  allNativeCurrencies.find(
    (nativeCurrencyInfo) =>
      nativeCurrencyInfo.sourceNetworkDisplayName === NetworkName.OsmosisTestnet
  ) as CurrencyInfo,

  //TODO: Allow to add IBC currencies for a testnet network WITHOUT having to add other testnet networks
  //(Ex: Here, If we want to add the IBC currency UNO, we have to add Juno testnet in networks/juno-testnet, it's annoying)

  {
    kind: "ibc",
    denom:
      "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
    displayName: "ATOM",
    sourceNetwork: "cosmos-hub-testnet",
    sourceNetworkDisplayName: NetworkName.CosmosHubTheta,
    sourceDenom: "uatom",
    sourceChannelPort: "transfer",
    sourceChannelId: "channel-0",
    destinationChannelPort: "transfer",
    destinationChannelId: "channel-141",
    icon: "icons/networks/cosmos-hub-circle.svg",
  },
  {
    kind: "ibc",
    denom:
      "ibc/EB7FB9C8B425F289B63703413327C2051030E848CE4EAAEA2E51199D6D39D3EC",
    displayName: "TORI",
    sourceNetwork: "teritori-testnet",
    sourceNetworkDisplayName: NetworkName.TeritoriTestnet,
    sourceDenom: "utori",
    sourceChannelPort: "transfer",
    sourceChannelId: "channel-362",
    destinationChannelPort: "transfer",
    destinationChannelId: "channel-0",
    icon: "icons/networks/teritori-circle.svg",
  },
];

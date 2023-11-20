import { chains, assets } from "chain-registry";

import { IBCCurrencyInfo } from "./ibc";
import { CosmosNetworkInfo, NativeCurrencyInfo, NetworkKind } from "./types";

const banList = [
  "permtestnet",
  "terpnetwork",
  "wavehashtestnet",
  "coreum",
  "seitestnet2",
];

export const networksFromCosmosRegistry = (): CosmosNetworkInfo[] => {
  return chains
    .filter((chain) => chain.chain_name && !banList.includes(chain.chain_name))
    .map((chain) => {
      //console.log(chain);
      const chainAssets =
        assets.find((a) => a.chain_name === chain.chain_name)?.assets || [];
      //console.log(chainAssets);
      const testnet = chain.network_type !== "mainnet";
      const cosmosNetwork: CosmosNetworkInfo = {
        id: `cosmos-registry:` + chain.chain_name,
        displayName: testnet
          ? chain.pretty_name.toLowerCase().includes("test")
            ? chain.pretty_name
            : chain.pretty_name + " Testnet"
          : chain.pretty_name,
        chainId: chain.chain_id,
        kind: NetworkKind.Cosmos,
        currencies: chainAssets
          .filter((asset) => !(asset.ibc || asset.base.startsWith("ibc/"))) // TODO: remove ibc filter and correctly map ibc currencies
          .map((asset) => {
            if (asset.ibc || asset.base.startsWith("ibc/")) {
              // TODO
              const ibcCurrency: IBCCurrencyInfo = {
                kind: "ibc",
                denom: asset.base,
                sourceNetwork: "TODO",
                sourceDenom: "TODO",
                sourceChannelPort: "TODO",
                sourceChannelId: "TODO",
                destinationChannelPort: "TODO",
                destinationChannelId: "TODO",
              };
              return ibcCurrency;
            }
            const nativeCurrency: NativeCurrencyInfo = {
              kind: "native",
              denom: asset.base,
              decimals:
                asset.denom_units.find((du) => du.denom === asset.display)
                  ?.exponent || 6,
              displayName: asset.symbol,
              coingeckoId: asset.coingecko_id || "not-found",
              icon:
                asset.logo_URIs?.svg ||
                asset.logo_URIs?.png ||
                asset.logo_URIs?.jpeg ||
                "not-found",
              color: "TODO",
            };
            return nativeCurrency;
          }),
        features: [],
        idPrefix: chain.chain_name,
        addressPrefix: chain.bech32_prefix,
        txExplorer:
          chain.explorers
            ?.find((ex) => !!ex.tx_page)
            ?.tx_page?.replace("${txHash}", "$hash") || "not-found",
        accountExplorer:
          chain.explorers
            ?.find((ex) => !!ex.account_page)
            ?.account_page?.replace("${accountAddress}", "$address") ||
          "not-found",
        contractExplorer:
          chain.explorers
            ?.find((ex) => !!ex.account_page)
            ?.account_page?.replace("${accountAddress}", "$address") ||
          "not-found",
        icon:
          chain.logo_URIs?.svg ||
          chain.logo_URIs?.png ||
          chain.logo_URIs?.jpeg ||
          "not-found",
        testnet,
        backendEndpoint: "",
        restEndpoint: chain.apis?.rest?.[0]?.address || "not-found",
        rpcEndpoint: chain.apis?.rpc?.[0]?.address || "not-found",
        stakeCurrency: chain.staking?.staking_tokens?.[0]?.denom || "not-found",
        gasPriceStep: {
          low: chain.fees?.fee_tokens?.[0]?.low_gas_price || 42,
          average: chain.fees?.fee_tokens?.[0]?.average_gas_price || 42,
          high: chain.fees?.fee_tokens?.[0]?.high_gas_price || 42,
        },
        nameServiceDefaultImage:
          chain.logo_URIs?.svg || chain.logo_URIs?.png || chain.logo_URIs?.jpeg,
        cosmosFeatures: [],
      };
      //console.log(cosmosNetwork);
      return cosmosNetwork;
    });
};

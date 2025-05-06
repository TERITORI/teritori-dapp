import { chains, assets } from "chain-registry";

import { IBCCurrencyInfo } from "./ibc";
import { CosmosNetworkInfo, NativeCurrencyInfo, NetworkKind } from "./types";

const banList: string[] = [];

export const networksFromCosmosRegistry = (): CosmosNetworkInfo[] => {
  return chains
    .map((chain) => {
      if (banList.includes(chain.chain_name)) {
        return undefined;
      }

      if (!chain.chain_id) {
        return undefined;
      }

      if (!chain.chain_name) {
        return undefined;
      }

      const chainAssets =
        assets.find((a) => a.chain_name === chain.chain_name)?.assets || [];

      const testnet = chain.network_type !== "mainnet";

      const bech32Prefix =
        chain.bech32_prefix || chain.bech32_config?.bech32PrefixAccAddr;
      if (!bech32Prefix) {
        return undefined;
      }

      const displayName =
        (testnet
          ? chain.pretty_name?.toLowerCase().includes("test")
            ? chain.pretty_name
            : chain.pretty_name + " Testnet"
          : chain.pretty_name) || chain.chain_id;

      const cosmosNetwork: CosmosNetworkInfo = {
        id: `cosmos-registry:` + chain.chain_name,
        displayName,
        chainId: chain.chain_id,
        registryName: chain.chain_name,
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
              variant: "cosmos",
              displayName: asset.symbol,
              coingeckoId: asset.coingecko_id || "not-found",
              icon: asset.logo_URIs?.svg || asset.logo_URIs?.png || "not-found",
              color: "TODO",
            };
            return nativeCurrency;
          }),
        features: [],
        featureObjects: [],
        idPrefix: chain.chain_name,
        addressPrefix: bech32Prefix,
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
        icon: chain.logo_URIs?.svg || chain.logo_URIs?.png || "not-found",
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
        nameServiceDefaultImage: chain.logo_URIs?.svg || chain.logo_URIs?.png,
        cosmosFeatures: [],
      };
      //console.log(cosmosNetwork);
      return cosmosNetwork;
    })
    .filter((chain): chain is CosmosNetworkInfo => !!chain);
};

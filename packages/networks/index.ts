import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Decimal } from "@cosmjs/math";
import { GasPrice, StargateClient } from "@cosmjs/stargate";
import { ChainInfo, Currency as KeplrCurrency } from "@keplr-wallet/types";
import { bech32 } from "bech32";

import { cosmosNetwork } from "./cosmos-hub";
import { cosmosThetaNetwork } from "./cosmos-hub-theta";
import { networksFromCosmosRegistry } from "./cosmos-registry";
import { ethereumNetwork } from "./ethereum";
import { ethereumGoerliNetwork } from "./ethereum-goerli";
import { NetworkFeature, NetworkFeatureObject } from "./features";
import { gnoDevNetwork } from "./gno-dev";
import { gnoPortalNetwork } from "./gno-portal";
import { gnoTeritoriNetwork } from "./gno-teritori";
import { gnoTest3Network } from "./gno-test3";
import { osmosisNetwork } from "./osmosis";
import { osmosisTestnetNetwork } from "./osmosis-testnet";
// import { solanaNetwork } from "./solana";
import { polygonNetwork } from "./polygon";
import { polygonMumbaiNetwork } from "./polygon-mumbai";
import { sagaNetwork } from "./saga";
import { sagaTest2 } from "./saga-test2";
import { teritoriNetwork } from "./teritori";
import { teritoriLocalnetNetwork } from "./teritori-localnet";
import { teritoriTestnetNetwork } from "./teritori-testnet";
import {
  CosmosNetworkInfo,
  EthereumNetworkInfo,
  GnoNetworkInfo,
  NativeCurrencyInfo,
  NetworkInfo,
  NetworkKind,
} from "./types";

export * from "./types";

const packageNetworks = [
  teritoriNetwork,
  cosmosNetwork,
  teritoriTestnetNetwork,
  teritoriLocalnetNetwork,
  cosmosThetaNetwork,
  ethereumGoerliNetwork,
  ethereumNetwork,
  osmosisNetwork,
  osmosisTestnetNetwork,
  gnoPortalNetwork,
  gnoTeritoriNetwork,
  gnoTest3Network,
  gnoDevNetwork,
  polygonMumbaiNetwork,
  polygonNetwork,
  sagaTest2,
  sagaNetwork,
];

export const defaultEnabledNetworks = [
  "teritori",
  "teritori-testnet",
  "ethereum",
  "ethereum-goerli",
  "polygon",
  "polygon-mumbai",
  "cosmos-hub",
  "osmosis",
  "gno-portal",
  "cosmos-registry:juno",
  "cosmos-registry:kujira",
  "cosmos-registry:axelar",
  "cosmos-registry:evmos",
  "cosmos-registry:chihuahua",
];

export const allNetworks = [
  ...packageNetworks,
  ...networksFromCosmosRegistry().filter(
    (rn) => !packageNetworks.some((pn) => pn.overrides === rn.id),
  ),
].sort((a, b) => a.displayName.localeCompare(b.displayName));

export const getCurrency = (
  networkId: string | undefined,
  denom: string | undefined,
) => {
  if (!networkId || !denom) {
    return undefined;
  }
  return getNetwork(networkId)?.currencies.find((c) => c.denom === denom);
};

export const getIBCCurrency = (
  networkId: string | undefined,
  denom: string | undefined,
) => {
  const currency = getCurrency(networkId, denom);
  if (currency?.kind !== "ibc") {
    return undefined;
  }
  return currency;
};

export const getNativeCurrency = (
  networkId: string | undefined,
  denom: string | undefined,
) => {
  const currency = getCurrency(networkId, denom);
  if (currency?.kind === "ibc") {
    const ibcNativeCurrency = getCurrency(
      currency.sourceNetwork,
      currency.sourceDenom,
    );
    if (ibcNativeCurrency?.kind !== "native") {
      return undefined;
    }
    return ibcNativeCurrency;
  }
  return currency;
};

export const getStakingCurrency = (networkId: string | undefined) => {
  const network = getNetwork(networkId);
  if (!network || !("stakeCurrency" in network)) {
    return undefined;
  }
  return getNativeCurrency(networkId, network.stakeCurrency);
};

export const getNetwork = (networkId: string | undefined) => {
  if (!networkId) {
    return undefined;
  }
  return allNetworks.find((n) => n.id === networkId);
};

const mustGetNetwork = (networkId: string | undefined) => {
  const network = getNetwork(networkId);
  if (!network) {
    throw new Error(`unknown network '${networkId}'`);
  }
  return network;
};

export const getNetworkByIdPrefix = (idPrefix: string | undefined) => {
  if (!idPrefix) {
    return undefined;
  }
  return allNetworks.find((n) => n.idPrefix === idPrefix);
};

export const parseNetworkObjectId = (
  id: string | undefined,
): [NetworkInfo | undefined, string] => {
  if (!id) {
    return [undefined, ""];
  }
  const parts = id.split("-");
  if (parts.length < 2) {
    return [undefined, ""];
  }
  const network = getNetworkByIdPrefix(parts[0]);
  return [network, id.substring(parts[0].length + 1)];
};

export const parseNftId = (
  id: string | undefined,
): [NetworkInfo | undefined, string, string] => {
  const [network, subId] = parseNetworkObjectId(id);
  if (!network) {
    return [undefined, "", ""];
  }
  const parts = subId.split("-");
  if (parts.length < 2) {
    return [undefined, "", ""];
  }
  return [network, parts[0], subId.substring(parts[0].length + 1)];
};

export const parseUserId = (
  id: string | undefined,
): [NetworkInfo | undefined, string] => {
  const [network, rest] = parseNetworkObjectId(id);
  if (network?.kind === NetworkKind.Gno) {
    try {
      bech32.decode(rest);
      return [network, rest];
    } catch {}
    return [network, "gno.land/" + rest.replaceAll("-", "/")];
  }
  return [network, rest];
};

export const parseCollectionId = (
  id: string | undefined,
): [NetworkInfo | undefined, string] => {
  return parseNetworkObjectId(id);
};

export const parseActivityId = (
  id: string | undefined,
): [NetworkInfo | undefined, string, string] => {
  const [network, subId] = parseNetworkObjectId(id);
  if (!network) {
    return [undefined, "", ""];
  }
  const parts = subId.split("-");
  if (parts.length < 2) {
    return [undefined, "", ""];
  }
  return [network, parts[0], subId.substring(parts[0].length + 1)];
};

export const getNetworkObjectId = (
  networkId: string | null | undefined,
  subId: string | null | undefined,
) => {
  if (!networkId || !subId) {
    return "";
  }
  const network = getNetwork(networkId);
  return `${network?.idPrefix}-${subId}`;
};

export const getNftId = (
  networkId: string | null | undefined,
  nftContractAddress: string | null | undefined,
  tokenId: string | null | undefined,
) => {
  if (!networkId || !nftContractAddress || !tokenId) {
    return "";
  }
  const network = getNetwork(networkId);
  if (!network) {
    return "";
  }
  return `${network.idPrefix}-${nftContractAddress}-${tokenId}`;
};

export const getUserId = (
  networkId: string | null | undefined,
  address: string | null | undefined,
) => {
  if (!networkId || !address) {
    return "";
  }
  const network = getNetwork(networkId);
  if (network?.kind === NetworkKind.Gno && address.startsWith("gno.land/")) {
    address = address.substring("gno.land/".length).replaceAll("/", "-");
  }
  return `${network?.idPrefix}-${address}`;
};

export const getCollectionId = (
  networkId: string | undefined,
  address: string | undefined,
) => {
  if (!networkId || !address) {
    return "";
  }
  const network = getNetwork(networkId);
  return `${network?.idPrefix}-${address}`;
};

export const getCosmosNetwork = (
  networkId: string | undefined,
): CosmosNetworkInfo | undefined => {
  const network = getNetwork(networkId);
  if (network === undefined) {
    return undefined;
  }
  if (network.kind !== NetworkKind.Cosmos) {
    return undefined;
  }
  return network;
};

export const getCosmosNetworkByChainId = (chainId: string | undefined) => {
  return allNetworks.find((n): n is CosmosNetworkInfo => {
    if (n.kind === NetworkKind.Cosmos && n.chainId === chainId) {
      return true;
    }
    return false;
  });
};

export const mustGetCosmosNetwork = (
  networkId: string | undefined,
): CosmosNetworkInfo => {
  const network = getNetwork(networkId);
  if (network === undefined) {
    throw new Error(`unknown network '${networkId}'`);
  }
  if (network.kind !== NetworkKind.Cosmos) {
    throw new Error(`'${networkId}' is not a cosmos network`);
  }
  return network;
};

export const getGnoNetwork = (
  networkId: string | undefined,
): GnoNetworkInfo | undefined => {
  const network = getNetwork(networkId);
  if (network?.kind !== NetworkKind.Gno) {
    return undefined;
  }
  return network;
};

export const mustGetGnoNetwork = (
  networkId: string | undefined,
): GnoNetworkInfo => {
  const network = mustGetNetwork(networkId);
  if (network.kind !== NetworkKind.Gno) {
    throw new Error(`'${networkId}' is not a gno network`);
  }
  return network;
};

export const getGnoNetworkFromChainId = (chainId: string | undefined) => {
  if (!chainId) {
    return undefined;
  }
  return allNetworks.find(
    (network) =>
      network.kind === NetworkKind.Gno && network.chainId === chainId,
  );
};

export const getEthereumNetwork = (
  networkId: string | undefined,
): EthereumNetworkInfo | undefined => {
  const network = getNetwork(networkId);
  if (network === undefined) {
    return undefined;
  }
  if (network.kind !== NetworkKind.Ethereum) {
    return undefined;
  }
  return network;
};

export const mustGetEthereumNetwork = (
  networkId: string | undefined,
): EthereumNetworkInfo => {
  const network = getNetwork(networkId);
  if (network === undefined) {
    throw new Error(`unknown network '${networkId}'`);
  }
  if (network.kind !== NetworkKind.Ethereum) {
    throw new Error(`'${networkId}' is not an ethereum network`);
  }
  return network;
};

export const keplrCurrencyFromNativeCurrencyInfo = (
  nativeCurrency: NativeCurrencyInfo | undefined,
): KeplrCurrency | undefined => {
  if (!nativeCurrency) {
    return undefined;
  }
  return {
    coinDenom: nativeCurrency.displayName,
    coinMinimalDenom: nativeCurrency.denom,
    coinDecimals: nativeCurrency.decimals,
    coinGeckoId: nativeCurrency.coingeckoId,
  };
};

// FIXME: consider directly using ChainInfo in NetworkInfo

export const keplrChainInfoFromNetworkInfo = (
  network: CosmosNetworkInfo,
): ChainInfo => {
  const stakeCurrency = keplrCurrencyFromNativeCurrencyInfo(
    getNativeCurrency(network.id, network.stakeCurrency),
  );
  if (!stakeCurrency) {
    throw new Error("stake currency not found");
  }
  return {
    chainId: network.chainId,
    chainName: network.displayName,
    rpc: network.rpcEndpoint,
    rest: network.restEndpoint,
    walletUrlForStaking: network.walletUrlForStaking,
    stakeCurrency,
    bip44: {
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: network.addressPrefix,
      bech32PrefixAccPub: `${network.addressPrefix}pub`,
      bech32PrefixValAddr: `${network.addressPrefix}valoper`,
      bech32PrefixValPub: `${network.addressPrefix}valoperpub`,
      bech32PrefixConsAddr: `${network.addressPrefix}valcons`,
      bech32PrefixConsPub: `${network.addressPrefix}valconspub`,
    },
    currencies: [stakeCurrency],
    feeCurrencies: [stakeCurrency],
    features: network.cosmosFeatures,
  };
};

export const cosmosNetworkGasPrice = (
  network: CosmosNetworkInfo,
  kind: "low" | "average" | "high",
) => {
  const feeCurrency = getStakingCurrency(network.id);
  if (!feeCurrency) {
    return undefined;
  }
  const floatGasPrice = network.gasPriceStep[kind];
  const decimalGasPrice = Decimal.fromUserInput(
    floatGasPrice.toString(),
    feeCurrency.decimals,
  );
  return new GasPrice(decimalGasPrice, feeCurrency.denom);
};

export const getNetworkFeature = <
  F extends NetworkFeature,
  FO extends NetworkFeatureObject,
  R = FO extends { type: F } ? FO : never,
>(
  networkId: string | undefined,
  feature: F,
) => {
  if (!networkId) {
    return undefined;
  }
  const network = getNetwork(networkId);
  if (!network?.featureObjects) {
    return undefined;
  }
  return network.featureObjects.find((f) => f.type === feature) as
    | R
    | undefined;
};

export const mustGetNonSigningCosmWasmClient = async (networkId: string) => {
  const network = mustGetCosmosNetwork(networkId);
  return await CosmWasmClient.connect(network.rpcEndpoint);
};

export const getNonSigningStargateClient = async (networkId: string) => {
  const network = mustGetCosmosNetwork(networkId);
  return await StargateClient.connect(network.rpcEndpoint);
};

export const txExplorerLink = (
  networkId: string | undefined,
  txHash: string,
) => {
  const network = getNetwork(networkId);
  if (!network?.txExplorer) {
    return "/";
  }
  return network.txExplorer.replace("$hash", txHash);
};

export const accountExplorerLink = (
  networkId: string | undefined,
  address: string,
) => {
  const network = getNetwork(networkId);
  if (!network?.accountExplorer) {
    return "/";
  }
  return network.accountExplorer.replace("$address", address);
};

export const contractExplorerLink = (
  networkId: string | undefined,
  address: string,
) => {
  const network = getNetwork(networkId);
  if (!network?.contractExplorer) {
    return "/";
  }
  return network.contractExplorer.replace("$address", address);
};

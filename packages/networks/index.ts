import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import { Decimal } from "@cosmjs/math";
import { Registry } from "@cosmjs/proto-signing";
import {
  SigningStargateClient,
  StargateClient,
  GasPrice,
  defaultRegistryTypes,
} from "@cosmjs/stargate";
import { ChainInfo, Currency as KeplrCurrency } from "@keplr-wallet/types";
import { bech32 } from "bech32";

import { cosmosNetwork } from "./cosmos-hub";
import { cosmosThetaNetwork } from "./cosmos-hub-theta";
import { ethereumNetwork } from "./ethereum";
import { ethereumGoerliNetwork } from "./ethereum-goerli";
import { gnoDevNetwork } from "./gno-dev";
import { gnoTeritoriNetwork } from "./gno-teritori";
import { gnoTest3Network } from "./gno-test3";
import { junoNetwork } from "./juno";
import { osmosisNetwork } from "./osmosis";
import { osmosisTestnetNetwork } from "./osmosis-testnet";
// import { solanaNetwork } from "./solana";
import { teritoriNetwork } from "./teritori";
import { teritoriTestnetNetwork } from "./teritori-testnet";
import {
  CosmosNetworkInfo,
  CurrencyInfo,
  EthereumNetworkInfo,
  GnoNetworkInfo,
  NativeCurrencyInfo,
  NetworkInfo,
  NetworkKind,
} from "./types";
import { MsgBurnTokens } from "../api/teritori/mint";
import { getKeplr } from "../utils/keplr";

export * from "./types";

export const WEI_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000";

export const allNetworks = [
  teritoriNetwork,
  cosmosNetwork,
  teritoriTestnetNetwork,
  cosmosThetaNetwork,
  ethereumGoerliNetwork,
  ethereumNetwork,
  junoNetwork,
  osmosisNetwork,
  osmosisTestnetNetwork,
  gnoTest3Network,
  gnoDevNetwork,
  gnoTeritoriNetwork,
  // solanaNetwork,
];

const pbTypesRegistry = new Registry(defaultRegistryTypes);
pbTypesRegistry.register("/teritori.mint.v1beta1.MsgBurnTokens", MsgBurnTokens);

export const getCurrency = (
  networkId: string | undefined,
  denom: string | undefined
) => {
  if (!networkId || !denom) {
    return undefined;
  }
  return getNetwork(networkId)?.currencies.find((c) => c.denom === denom);
};

export const getToriNativeCurrency = (networkId: string) => {
  const network = getNetwork(networkId);
  if (network?.kind === NetworkKind.Cosmos)
    return network?.currencies.find(
      (currencyInfo: CurrencyInfo) => currencyInfo.kind === "native"
    ) as NativeCurrencyInfo;
  else {
    const toriIbcCurrency = network?.currencies.find(
      (currencyInfo: CurrencyInfo) =>
        currencyInfo.kind === "ibc" && currencyInfo.sourceDenom === "utori"
    );
    return getNativeCurrency(networkId, toriIbcCurrency?.denom);
  }
};

export const getIBCCurrency = (
  networkId: string | undefined,
  denom: string | undefined
) => {
  const currency = getCurrency(networkId, denom);
  if (currency?.kind !== "ibc") {
    return undefined;
  }
  return currency;
};

export const getNativeCurrency = (
  networkId: string | undefined,
  denom: string | undefined
) => {
  const currency = getCurrency(networkId, denom);
  if (currency?.kind === "ibc") {
    const ibcNativeCurrency = getCurrency(
      currency.sourceNetwork,
      currency.sourceDenom
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

export const mustGetNetwork = (networkId: string | undefined) => {
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
  id: string | undefined
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
  id: string | undefined
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
  id: string | undefined
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
  id: string | undefined
): [NetworkInfo | undefined, string] => {
  return parseNetworkObjectId(id);
};

export const parseActivityId = (
  id: string | undefined
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
  subId: string | null | undefined
) => {
  if (!networkId || !subId) {
    return "";
  }
  const network = getNetwork(networkId);
  return `${network?.idPrefix}-${subId}`;
};

export const getUserId = (
  networkId: string | null | undefined,
  address: string | null | undefined
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
  address: string | undefined
) => {
  if (!networkId || !address) {
    return "";
  }
  const network = getNetwork(networkId);
  return `${network?.idPrefix}-${address}`;
};

export const getCosmosNetwork = (
  networkId: string | undefined
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

export const mustGetCosmosNetwork = (
  networkId: string | undefined
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
  networkId: string | undefined
): GnoNetworkInfo | undefined => {
  const network = getNetwork(networkId);
  if (network?.kind !== NetworkKind.Gno) {
    return undefined;
  }
  return network;
};

export const mustGetGnoNetwork = (
  networkId: string | undefined
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
    (network) => network.kind === NetworkKind.Gno && network.chainId === chainId
  );
};

export const getEthereumNetwork = (
  networkId: string | undefined
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
  networkId: string | undefined
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
  nativeCurrency: NativeCurrencyInfo | undefined
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
  network: CosmosNetworkInfo
): ChainInfo => {
  const stakeCurrency = keplrCurrencyFromNativeCurrencyInfo(
    getNativeCurrency(network.id, network.stakeCurrency)
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
    gasPriceStep: network.gasPriceStep,
    features: network.cosmosFeatures,
  };
};

const cosmosNetworkGasPrice = (
  network: CosmosNetworkInfo,
  kind: "low" | "average" | "high"
) => {
  const feeCurrency = getStakingCurrency(network.id);
  if (!feeCurrency) {
    return undefined;
  }
  const floatGasPrice = network.gasPriceStep[kind];
  const decimalGasPrice = Decimal.fromUserInput(
    floatGasPrice.toString(),
    feeCurrency.decimals
  );
  return new GasPrice(decimalGasPrice, feeCurrency.denom);
};

export const getKeplrSigner = async (networkId: string) => {
  const network = mustGetCosmosNetwork(networkId);

  const keplr = getKeplr();

  await keplr.experimentalSuggestChain(keplrChainInfoFromNetworkInfo(network));

  await keplr.enable(network.chainId);

  return keplr.getOfflineSignerAuto(network.chainId);
};

export const getKeplrSigningStargateClient = async (
  networkId: string,
  gasPriceKind: "low" | "average" | "high" = "average"
) => {
  const network = mustGetCosmosNetwork(networkId);

  const gasPrice = cosmosNetworkGasPrice(network, gasPriceKind);
  if (!gasPrice) {
    throw new Error("gas price not found");
  }

  const signer = await getKeplrSigner(networkId);

  return await SigningStargateClient.connectWithSigner(
    network.rpcEndpoint,
    signer,
    {
      gasPrice,
      registry: pbTypesRegistry,
    }
  );
};

export const getNonSigningStargateClient = async (networkId: string) => {
  const network = mustGetCosmosNetwork(networkId);

  return await StargateClient.connect(network.rpcEndpoint);
};

export const getKeplrSigningCosmWasmClient = async (
  networkId: string,
  gasPriceKind: "low" | "average" | "high" = "average"
) => {
  const network = mustGetCosmosNetwork(networkId);

  const signer = await getKeplrSigner(networkId);

  const gasPrice = cosmosNetworkGasPrice(network, gasPriceKind);
  if (!gasPrice) {
    throw new Error("gas price not found");
  }

  return SigningCosmWasmClient.connectWithSigner(network.rpcEndpoint, signer, {
    gasPrice,
  });
};

export const mustGetNonSigningCosmWasmClient = async (networkId: string) => {
  const network = mustGetCosmosNetwork(networkId);
  return await CosmWasmClient.connect(network.rpcEndpoint);
};

export const txExplorerLink = (
  networkId: string | undefined,
  txHash: string
) => {
  const network = getNetwork(networkId);
  if (!network?.txExplorer) {
    return "/";
  }
  return network.txExplorer.replace("$hash", txHash);
};

export const accountExplorerLink = (
  networkId: string | undefined,
  address: string
) => {
  const network = getNetwork(networkId);
  if (!network?.accountExplorer) {
    return "/";
  }
  return network.accountExplorer.replace("$address", address);
};

export const contractExplorerLink = (
  networkId: string | undefined,
  address: string
) => {
  const network = getNetwork(networkId);
  if (!network?.contractExplorer) {
    return "/";
  }
  return network.contractExplorer.replace("$address", address);
};

export const selectableNetworks = (process.env.SELECTABLE_NETWORKS_IDS || "")
  .split(",")
  .map((s) => getNetwork(s.trim()))
  .filter((n): n is NetworkInfo => !!n);

export const selectableCosmosNetworks = selectableNetworks.filter(
  (n): n is CosmosNetworkInfo => n.kind === NetworkKind.Cosmos
);

export const selectableEthereumNetworks = selectableNetworks.filter(
  (n): n is EthereumNetworkInfo => n.kind === NetworkKind.Ethereum
);

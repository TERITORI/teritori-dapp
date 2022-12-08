import { Decimal } from "@cosmjs/math";
import { SigningStargateClient } from "@cosmjs/stargate";
import { ChainInfo, Currency as KeplrCurrency } from "@keplr-wallet/types";
import { GasPrice } from "cosmwasm";

import { getKeplr } from "../utils/keplr";
import { NetworkName } from "./NetworkName";
import { cosmosNetwork } from "./cosmos-hub";
import { cosmosThetaNetwork } from "./cosmos-hub-theta";
import { ethereumNetwork } from "./ethereum";
import { junoNetwork } from "./juno";
import { osmosisNetwork } from "./osmosis";
import { solanaNetwork } from "./solana";
import { teritoriNetwork } from "./teritori";
import { teritoriTestnetNetwork } from "./teritori-testnet";
import { NativeCurrencyInfo, NetworkInfo } from "./types";
import {osmosisTestnetNetwork} from "./osmosis-testnet";
export * from "./types";

export const allNetworks: NetworkInfo[] = [
  teritoriNetwork,
  teritoriTestnetNetwork,
  cosmosNetwork,
  cosmosThetaNetwork,
  osmosisNetwork,
  osmosisTestnetNetwork,
  // TODO: Complete the data for these
  junoNetwork,
  ethereumNetwork,
  solanaNetwork,
];

export const displayedNetworks = () => {
  // ----  Force displaying Testnet networks if dev environment
  if (isTeritoriTestnet()) {
    allNetworks.forEach((networkInfo, index) => {
      if (networkInfo.displayName === NetworkName.Teritori) {
        allNetworks[index].hidden = true;
      }
      if (networkInfo.displayName === NetworkName.TeritoriTestnet) {
        allNetworks[index].hidden = false;
      }
      if (networkInfo.displayName === NetworkName.CosmosHub) {
        allNetworks[index].hidden = true;
      }
      if (networkInfo.displayName === NetworkName.CosmosHubTheta) {
        allNetworks[index].hidden = false;
      }
      if (networkInfo.displayName === NetworkName.Osmosis) {
        allNetworks[index].hidden = true;
      }
      if (networkInfo.displayName === NetworkName.OsmosisTestnet) {
        allNetworks[index].hidden = false;
      }
    });
  }
  return allNetworks.filter(
    (networkInfo) => !networkInfo.hidden
  ) as NetworkInfo[];
};

export const isTeritoriTestnet = () => {
  const teritoriNetworkId = process.env.TERITORI_NETWORK_ID || "";
  return teritoriNetworkId.includes("testnet");
};

export const getCurrency = (
  networkId: string | undefined,
  denom: string | undefined
) => {
  if (!networkId || !denom) {
    return undefined;
  }
  return getNetwork(networkId)?.currencies.find((c) => c.denom === denom);
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

export const getNetwork = (networkId: string | undefined) => {
  if (!networkId) {
    return undefined;
  }
  return allNetworks.find((n) => n.id === networkId);
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
  network: NetworkInfo
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
    features: network.features,
  };
};

export const networkGasPrice = (
  networkId: string,
  kind: "low" | "average" | "high"
) => {
  const network = getNetwork(networkId);
  if (!network) {
    return undefined;
  }
  const feeCurrency = getNativeCurrency(networkId, network.stakeCurrency);
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

export const getKeplrSigningStargateClient = async (
  networkId: string,
  gasPriceKind: "low" | "average" | "high" = "average"
) => {
  const network = getNetwork(networkId);
  if (!network) {
    throw new Error("network not found");
  }

  const gasPrice = networkGasPrice(networkId, gasPriceKind);
  if (!gasPrice) {
    throw new Error("gas price not found");
  }

  const keplr = getKeplr();

  await keplr.experimentalSuggestChain(keplrChainInfoFromNetworkInfo(network));

  await keplr.enable(network.chainId);

  const signer = await keplr.getOfflineSignerAuto(network.chainId);

  return await SigningStargateClient.connectWithSigner(
    network.rpcEndpoint,
    signer,
    {
      gasPrice,
    }
  );
};

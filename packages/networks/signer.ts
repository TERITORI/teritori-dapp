import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { SigningStargateClient } from "@cosmjs/stargate";
import { KeplrSignOptions } from "@keplr-wallet/types";
import { Platform } from "react-native";

import { cosmosTypesRegistry, cosmosAminoTypes } from "./cosmos-types";

import {
  cosmosNetworkGasPrice,
  keplrChainInfoFromNetworkInfo,
  mustGetCosmosNetwork,
} from "@/networks/index";
import { convertKeplrSigner, getKeplr } from "@/utils/keplr";
import { getNativeWallet } from "@/utils/wallet/getNativeWallet";

export const getKeplrSigner = async (networkId: string) => {
  const network = mustGetCosmosNetwork(networkId);

  const keplr = getKeplr();

  await keplr.experimentalSuggestChain(keplrChainInfoFromNetworkInfo(network));

  await keplr.enable(network.chainId);

  const keplrSigner = await keplr.getOfflineSignerAuto(network.chainId);

  return convertKeplrSigner(keplrSigner);
};

export const getKeplrOnlyAminoSigner = async (
  networkId: string,
  signOptions?: KeplrSignOptions,
) => {
  const network = mustGetCosmosNetwork(networkId);

  const keplr = getKeplr();

  await keplr.experimentalSuggestChain(keplrChainInfoFromNetworkInfo(network));

  await keplr.enable(network.chainId);

  return keplr.getOfflineSignerOnlyAmino(network.chainId, signOptions);
};

export const getKeplrSigningStargateClient = async (
  networkId: string,
  gasPriceKind: "low" | "average" | "high" = "average",
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
      registry: cosmosTypesRegistry,
      aminoTypes: cosmosAminoTypes,
    },
  );
};

export const getKeplrSigningCosmWasmClient = async (
  networkId: string,
  gasPriceKind: "low" | "average" | "high" = "average",
) => {
  const network = mustGetCosmosNetwork(networkId);
  const gasPrice = cosmosNetworkGasPrice(network, gasPriceKind);
  if (!gasPrice) {
    throw new Error("gas price not found");
  }
  if (Platform.OS !== "web") {
    const wallet = await getNativeWallet(network.addressPrefix, 1); // todo make multi wallet

    return SigningCosmWasmClient.connectWithSigner(
      network.rpcEndpoint,
      wallet,
      {
        gasPrice,
      },
    );
  }

  const signer = await getKeplrSigner(networkId);

  return SigningCosmWasmClient.connectWithSigner(network.rpcEndpoint, signer, {
    gasPrice,
  });
};

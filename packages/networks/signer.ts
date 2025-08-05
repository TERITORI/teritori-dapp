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
// eslint-disable-next-line no-restricted-imports
import { selectWalletById } from "@/store/slices/wallets";
// eslint-disable-next-line no-restricted-imports
import { store } from "@/store/store";
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
    const selectedWalletId = store.getState().wallets.selectedWalletId;
    const selectedNativeWallet = selectWalletById(
      store.getState(),
      selectedWalletId,
    );
    if (!selectedNativeWallet) {
      throw new Error("no selected native wallet");
    }
    const wallet = await getNativeWallet(
      network.addressPrefix,
      selectedNativeWallet.index,
    );

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

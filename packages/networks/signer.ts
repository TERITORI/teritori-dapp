import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import {
  createWasmAminoConverters,
  wasmTypes,
} from "@cosmjs/cosmwasm-stargate/build/modules";
import { Registry } from "@cosmjs/proto-signing";
import {
  AminoTypes,
  createDefaultAminoConverters,
  defaultRegistryTypes,
  SigningStargateClient,
} from "@cosmjs/stargate";
import { Platform } from "react-native";

import {
  teritoriAminoConverters,
  teritoriProtoRegistry,
} from "@/api/teritori-chain";
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

export const cosmosTypesRegistry = new Registry([
  ...defaultRegistryTypes,
  ...wasmTypes,
  ...teritoriProtoRegistry,
]);
const cosmosAminoTypes = new AminoTypes({
  ...createDefaultAminoConverters(),
  ...createWasmAminoConverters(),
  ...teritoriAminoConverters,
});
export const getKeplrSigner = async (networkId: string) => {
  const network = mustGetCosmosNetwork(networkId);

  const keplr = getKeplr();

  await keplr.experimentalSuggestChain(keplrChainInfoFromNetworkInfo(network));

  await keplr.enable(network.chainId);

  const keplrSigner = await keplr.getOfflineSignerAuto(network.chainId);

  return convertKeplrSigner(keplrSigner);
};
const getKeplrOnlyAminoSigner = async (networkId: string) => {
  const network = mustGetCosmosNetwork(networkId);

  const keplr = getKeplr();

  await keplr.experimentalSuggestChain(keplrChainInfoFromNetworkInfo(network));

  await keplr.enable(network.chainId);

  return keplr.getOfflineSignerOnlyAmino(network.chainId);
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
export const getKeplrOnlyAminoStargateClient = async (
  networkId: string,
  gasPriceKind: "low" | "average" | "high" = "average",
) => {
  const network = mustGetCosmosNetwork(networkId);

  const gasPrice = cosmosNetworkGasPrice(network, gasPriceKind);
  if (!gasPrice) {
    throw new Error("gas price not found");
  }

  const signer = await getKeplrOnlyAminoSigner(networkId);

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

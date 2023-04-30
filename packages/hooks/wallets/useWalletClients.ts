import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { SigningStargateClient } from "@cosmjs/stargate";
import { useCallback } from "react";

import { useWallet } from "./useWallet";
import { useWalletKeplr } from "./useWalletKeplr";
import { TeritoriNameServiceClient } from "../../contracts-clients/teritori-name-service/TeritoriNameService.client";
import { TeritoriSocialFeedClient } from "../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.client";
import {
  getCosmosNetwork,
  getKeplrSigningCosmWasmClient,
  getKeplrSigningStargateClient,
} from "../../networks";

// we use lazy getters to not spam the user with chain suggest/enable requests
// we also cache clients to reduce init rpcs

const stargateClients: { [key: string]: Promise<SigningStargateClient> } = {};

export const useWalletStargateClient = (walletId: string | undefined) => {
  const wallet = useWallet(walletId);
  const walletKeplr = useWalletKeplr(walletId);
  return useCallback(() => {
    if (!walletId) {
      throw new Error("no wallet id");
    }
    if (!stargateClients[walletId]) {
      if (!wallet || !walletKeplr) {
        throw new Error("invalid wallet");
      }
      stargateClients[walletId] = getKeplrSigningStargateClient(
        walletKeplr,
        wallet.networkId
      );
    }
    return stargateClients[walletId];
  }, [wallet, walletId, walletKeplr]);
};

const cosmWasmClients: { [key: string]: Promise<SigningCosmWasmClient> } = {};

export const useWalletCosmWasmClient = (walletId: string | undefined) => {
  const wallet = useWallet(walletId);
  const walletKeplr = useWalletKeplr(walletId);
  return useCallback(() => {
    if (!walletId) {
      throw new Error("no wallet id");
    }
    if (!cosmWasmClients[walletId]) {
      if (!wallet || !walletKeplr) {
        throw new Error("invalid wallet");
      }
      cosmWasmClients[walletId] = getKeplrSigningCosmWasmClient(
        walletKeplr,
        wallet.networkId
      );
    }
    return cosmWasmClients[walletId];
  }, [wallet, walletId, walletKeplr]);
};

const socialFeedClients: { [key: string]: Promise<TeritoriSocialFeedClient> } =
  {};

export const useWalletSocialFeedClient = (walletId: string | undefined) => {
  const wallet = useWallet(walletId);
  const getCosmWasmClient = useWalletCosmWasmClient(walletId);
  return useCallback(() => {
    if (!walletId) {
      throw new Error("no wallet id");
    }
    if (!socialFeedClients[walletId]) {
      socialFeedClients[walletId] = (async () => {
        const network = getCosmosNetwork(wallet?.networkId);
        if (!wallet || !network?.socialFeedContractAddress) {
          throw new Error("invalid wallet");
        }
        const cosmWasmClient = await getCosmWasmClient();
        return new TeritoriSocialFeedClient(
          cosmWasmClient,
          wallet.address,
          network.socialFeedContractAddress
        );
      })();
    }
    return socialFeedClients[walletId];
  }, [getCosmWasmClient, wallet, walletId]);
};

const tnsClients: { [key: string]: Promise<TeritoriNameServiceClient> } = {};

export const useWalletTNSClient = (walletId: string | undefined) => {
  const wallet = useWallet(walletId);
  const getCosmWasmClient = useWalletCosmWasmClient(walletId);
  return useCallback(() => {
    if (!walletId) {
      throw new Error("no wallet id");
    }
    if (!tnsClients[walletId]) {
      tnsClients[walletId] = (async () => {
        const network = getCosmosNetwork(wallet?.networkId);
        if (!wallet || !network?.nameServiceContractAddress) {
          throw new Error("invalid wallet");
        }
        const cosmWasmClient = await getCosmWasmClient();
        return new TeritoriNameServiceClient(
          cosmWasmClient,
          wallet.address,
          network.nameServiceContractAddress
        );
      })();
    }
    return tnsClients[walletId];
  }, [getCosmWasmClient, wallet, walletId]);
};

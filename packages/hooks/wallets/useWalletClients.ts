import { useQuery } from "@tanstack/react-query";

import { useWallet } from "./useWallet";
import { useWalletKeplr } from "./useWalletKeplr";
import { signingSocialFeedClient } from "../../client-creators/socialFeedClient";
import { TeritoriNameServiceClient } from "../../contracts-clients/teritori-name-service/TeritoriNameService.client";
import {
  getCosmosNetwork,
  getKeplrSigningCosmWasmClient,
  getKeplrSigningStargateClient,
} from "../../networks";

export const useWalletStargateClient = (walletId: string | undefined) => {
  const wallet = useWallet(walletId);
  const walletKeplr = useWalletKeplr(walletId);
  const { data: client } = useQuery(
    ["walletStargateClient", walletId],
    async () => {
      if (!wallet || !walletKeplr) {
        throw new Error("no wallet");
      }
      const client = await getKeplrSigningStargateClient(
        walletKeplr,
        wallet.networkId
      );
      return client;
    },
    { staleTime: Infinity, enabled: !!wallet && !!walletKeplr }
  );
  return client;
};

export const useWalletCosmWasmClient = (walletId: string | undefined) => {
  const wallet = useWallet(walletId);
  const walletKeplr = useWalletKeplr(walletId);
  const { data: client } = useQuery(
    ["walletCosmWasmClient", walletId],
    async () => {
      if (!wallet || !walletKeplr) {
        throw new Error("no wallet");
      }
      const client = await getKeplrSigningCosmWasmClient(
        walletKeplr,
        wallet.networkId
      );
      return client;
    },
    { staleTime: Infinity, enabled: !!wallet && !!walletKeplr }
  );
  return client;
};

export const useWalletSocialFeedClient = (walletId: string | undefined) => {
  const wallet = useWallet(walletId);
  const walletKeplr = useWalletKeplr(walletId);
  const { data: client } = useQuery(
    ["walletSocialFeedClient", walletId],
    async () => {
      if (!wallet || !walletKeplr) {
        throw new Error("no wallet");
      }
      const client = await signingSocialFeedClient({
        keplr: walletKeplr,
        networkId: wallet.networkId,
        walletAddress: wallet.address,
      });
      return client;
    },
    { staleTime: Infinity, enabled: !!wallet && !!walletKeplr }
  );
  return client;
};

export const useWalletTNSClient = (walletId: string | undefined) => {
  const wallet = useWallet(walletId);
  const cosmWasmClient = useWalletCosmWasmClient(walletId);
  const { data: client } = useQuery(
    ["walletTNSClient", walletId],
    async () => {
      const network = getCosmosNetwork(wallet?.networkId);
      if (!network?.nameServiceContractAddress) {
        return undefined;
      }
      if (!wallet || !cosmWasmClient) {
        throw new Error("unexpected state");
      }
      const client = new TeritoriNameServiceClient(
        cosmWasmClient,
        wallet.address,
        network.nameServiceContractAddress
      );
      return client;
    },
    { staleTime: Infinity, enabled: !!wallet && !!cosmWasmClient }
  );
  return client;
};

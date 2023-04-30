import { useMemo } from "react";

import { UseWalletProviderResult } from "./types";
import { Wallet } from "./wallet";
import { NetworkKind, getUserId } from "../../networks";
import { WalletProvider } from "../../utils/walletProvider";
import { useWalletConnect } from "../WalletConnectProvider";

export const useWalletConnectWallets: () => UseWalletProviderResult = () => {
  const { accounts } = useWalletConnect();

  return useMemo(() => {
    const wallets = accounts.map((info) => {
      const address = info.account.address;

      const userId = getUserId(info.networkId, address);

      const wallet: Wallet = {
        address,
        provider: WalletProvider.WalletConnect,
        networkKind: NetworkKind.Cosmos,
        networkId: info.networkId,
        userId,
        connected: true,
        id: `walletconnect-${info.networkId}-${address}`,
      };

      return wallet;
    });

    return {
      hasProvider: true,
      ready: true,
      wallets,
      providerKind: WalletProvider.WalletConnect,
    };
  }, [accounts]);
};

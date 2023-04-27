import { useMemo } from "react";

import { Wallet } from "./wallet";
import { NetworkKind, getUserId } from "../../networks";
import { WalletProvider } from "../../utils/walletProvider";
import { useWalletConnect } from "../WalletConnectProvider";

export type UseWalletConnectResult =
  | [true, boolean, Wallet[]]
  | [false, boolean, undefined];

export const useWalletConnectWallets: () => UseWalletConnectResult = () => {
  const { accounts } = useWalletConnect();

  const wallets = useMemo(() => {
    const wallets = accounts.map((info, index) => {
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
      console.log("walletconnect", index, wallet);
      return wallet;
    });

    return wallets;
  }, [accounts]);

  return [true, true, wallets];
};

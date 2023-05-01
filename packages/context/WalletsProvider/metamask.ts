import { useMetaMask } from "metamask-react";
import { useMemo } from "react";

import { UseWalletProviderResult } from "./types";
import { Wallet } from "./wallet";
import { NetworkKind, allNetworks, getUserId } from "../../networks";
import { WalletProvider } from "../../utils/walletProvider";

const initialState = {
  hasProvider: typeof (window as any).ethereum !== "undefined",
  ready: true,
  wallets: [],
  providerKind: WalletProvider.Metamask,
};

export const useMetamaskWallets: () => UseWalletProviderResult = () => {
  const { status, account: address, chainId } = useMetaMask();

  const isConnected = status === "connected";

  return useMemo(() => {
    if (!chainId) {
      return initialState;
    }

    const network = allNetworks.find(
      (n) =>
        n.kind === NetworkKind.Ethereum && n.chainId === parseInt(chainId, 16)
    );
    if (!network || !address || !isConnected) {
      return initialState;
    }

    const walletId = `metamask-${network.id}-${address}`;
    const wallet: Wallet = {
      id: walletId,
      address,
      provider: WalletProvider.Metamask,
      networkKind: NetworkKind.Ethereum,
      networkId: network.id,
      userId: getUserId(network.id, address),
    };

    return {
      ...initialState,
      wallets: wallet ? [wallet] : [],
    };
  }, [address, chainId, isConnected]);
};

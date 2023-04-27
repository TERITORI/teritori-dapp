import { useMetaMask } from "metamask-react";
import { useMemo } from "react";

import { Wallet } from "./wallet";
import { NetworkKind, allNetworks, getUserId } from "../../networks";
import { WalletProvider } from "../../utils/walletProvider";

export type UseMetamaskResult =
  | [true, boolean, Wallet[]]
  | [false, boolean, undefined];

export const useMetamask: () => UseMetamaskResult = () => {
  const { status, account: address, chainId } = useMetaMask();

  const isConnected = status === "connected";

  const wallet: Wallet | undefined = useMemo(() => {
    console.log("finding eth wallet", chainId);
    if (!chainId) {
      return undefined;
    }
    const network = allNetworks.find(
      (n) =>
        n.kind === NetworkKind.Ethereum && n.chainId === parseInt(chainId, 16)
    );
    if (!network || !address || !isConnected) {
      console.warn("fail", network, address, isConnected);
      return;
    }
    const walletId = `metamask-${network.id}-${address}`;
    const wallet: Wallet = {
      id: walletId,
      address,
      provider: WalletProvider.Metamask,
      networkKind: NetworkKind.Ethereum,
      networkId: network.id,
      userId: getUserId(network.id, address),
      connected: isConnected,
    };
    return wallet;
  }, [address, chainId, isConnected]);

  const hasMetamask = useMemo(() => {
    return typeof (window as any).ethereum !== "undefined";
  }, []);

  return hasMetamask
    ? [true, true, wallet ? [wallet] : []]
    : [false, true, undefined];
};

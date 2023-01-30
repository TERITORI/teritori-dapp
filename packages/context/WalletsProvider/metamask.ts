import { useMetaMask } from "metamask-react";
import { useMemo } from "react";

import { useSelectedNetworkInfo } from "../../hooks/useSelectedNetwork";
import { setSelectedWalletId } from "../../store/slices/settings";
import { useAppDispatch } from "../../store/store";
import { Network } from "../../utils/network";
import { WalletProvider } from "../../utils/walletProvider";
import { Wallet } from "./wallet";

export type UseMetamaskResult =
  | [true, boolean, Wallet[]]
  | [false, boolean, undefined];

export const useMetamask: () => UseMetamaskResult = () => {
  const { status, account: address } = useMetaMask();
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const dispatch = useAppDispatch();

  const isConnected = status === "connected";

  const wallet: Wallet | undefined = useMemo(() => {
    if (!address || !isConnected) return;

    const walletId = `metamask-${address}`;
    if (selectedNetworkInfo?.network === Network.Ethereum) {
      dispatch(setSelectedWalletId(walletId));
    }
    return {
      id: walletId,
      address: address?.toString() || "",
      provider: WalletProvider.Metamask,
      connected: isConnected,
    };
  }, [address, isConnected, selectedNetworkInfo?.network]);

  const hasMetamask = useMemo(() => {
    return typeof (window as any).ethereum !== "undefined";
  }, []);

  return hasMetamask
    ? [true, true, wallet ? [wallet] : []]
    : [false, true, undefined];
};

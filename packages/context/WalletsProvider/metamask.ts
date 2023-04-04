import { useMetaMask } from "metamask-react";
import { useMemo } from "react";

import { Wallet } from "./wallet";
import { useSelectedNetworkInfo } from "../../hooks/useSelectedNetwork";
import { NetworkKind, getUserId } from "../../networks";
import { setSelectedWalletId } from "../../store/slices/settings";
import { useAppDispatch } from "../../store/store";
import { WalletProvider } from "../../utils/walletProvider";

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
    if (selectedNetworkInfo?.kind === NetworkKind.Ethereum) {
      dispatch(setSelectedWalletId(walletId));
    }
    const wallet: Wallet = {
      id: walletId,
      address,
      provider: WalletProvider.Metamask,
      networkKind: NetworkKind.Ethereum,
      networkId: selectedNetworkInfo?.id || "",
      userId: getUserId(selectedNetworkInfo?.id, address || ""),
      connected: isConnected,
    };
    return wallet;
  }, [address, dispatch, isConnected, selectedNetworkInfo]);

  const hasMetamask = useMemo(() => {
    return typeof (window as any).ethereum !== "undefined";
  }, []);

  return hasMetamask
    ? [true, true, wallet ? [wallet] : []]
    : [false, true, undefined];
};

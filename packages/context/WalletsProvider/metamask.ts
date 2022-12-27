import { useMemo } from "react";
import { useAccount } from "wagmi";
import { useSelectedNetworkInfo } from "../../hooks/useSelectedNetworkInfo";
import { setSelectedWalletId } from "../../store/slices/settings";
import { useAppDispatch } from "../../store/store";
import { Network } from "../../utils/network";

import { WalletProvider } from "../../utils/walletProvider";
import { Wallet } from "./wallet";

export type UseMetamaskResult =
  | [true, boolean, Wallet[]]
  | [false, boolean, undefined];

export const useMetamask: () => UseMetamaskResult = () => {
  const { address, isConnected } = useAccount();
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const dispatch = useAppDispatch();

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
  }, [address, isConnected]);

  const hasMetamask = useMemo(() => {
    return typeof window.ethereum !== "undefined";
  }, []);

  return hasMetamask
    ? [true, true, wallet ? [wallet] : []]
    : [false, true, undefined];
};

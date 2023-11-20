import { useMetaMask } from "metamask-react";
import { useMemo, useEffect } from "react";

import { Wallet } from "./wallet";
import { useSelectedNetworkInfo } from "../../hooks/useSelectedNetwork";
import { NetworkKind, getUserId } from "../../networks";
import { ethereumNetwork } from "../../networks/ethereum";
import { setSelectedWalletId } from "../../store/slices/settings";
import { useAppDispatch } from "../../store/store";
import { WalletProvider } from "../../utils/walletProvider";

type UseMetamaskResult =
  | [true, boolean, Wallet[]]
  | [false, boolean, undefined];

export const useMetamask: () => UseMetamaskResult = () => {
  const { status, account: address } = useMetaMask();
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const dispatch = useAppDispatch();

  const isConnected = status === "connected";

  const wallet: Wallet | undefined = useMemo(() => {
    if (!address || !isConnected) return;
    let targetNetworkId = ethereumNetwork.id;
    if (selectedNetworkInfo?.kind === NetworkKind.Ethereum) {
      targetNetworkId = selectedNetworkInfo.id;
    }
    const userId = getUserId(targetNetworkId, address);
    const walletId = `metamask-${address}`;
    const wallet: Wallet = {
      id: walletId,
      address,
      provider: WalletProvider.Metamask,
      networkKind: NetworkKind.Ethereum,
      networkId: targetNetworkId,
      userId,
      connected: isConnected,
    };
    return wallet;
  }, [address, isConnected, selectedNetworkInfo]);

  useEffect(() => {
    if (
      wallet?.connected &&
      selectedNetworkInfo?.kind === NetworkKind.Ethereum
    ) {
      dispatch(setSelectedWalletId(wallet.id));
    }
  }, [dispatch, selectedNetworkInfo, wallet]);

  const hasMetamask = useMemo(() => {
    return typeof (window as any).ethereum !== "undefined";
  }, []);

  return hasMetamask
    ? [true, true, wallet ? [wallet] : []]
    : [false, true, undefined];
};

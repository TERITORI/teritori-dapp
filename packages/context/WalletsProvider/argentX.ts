import { argent, useAccount, useConnect } from "@starknet-react/core";
import { useMemo, useEffect } from "react";

import { Wallet } from "./wallet";
import { useSelectedNetworkInfo } from "../../hooks/useSelectedNetwork";
import { NetworkKind, getUserId } from "../../networks";
import { setSelectedWalletId } from "../../store/slices/settings";
import { useAppDispatch } from "../../store/store";
import { WalletProvider } from "../../utils/walletProvider";

import { starknetNetwork } from "@/networks/starknet";

type UseArgentXResult = [true, boolean, Wallet[]] | [false, boolean, undefined];

export const useArgentX: () => UseArgentXResult = () => {
  // const isArgentXConnected = useSelector(selectIsArgentXConnected);

  const selectedNetworkInfo = useSelectedNetworkInfo();
  const { address, status } = useAccount();
  const { connect } = useConnect();
  const dispatch = useAppDispatch();

  const isConnected = status === "connected";

  useEffect(() => {
    // NOTE: try to connect to argentX if not connected
    if (selectedNetworkInfo?.kind === NetworkKind.Starknet && !isConnected) {
      connect({ connector: argent() });
    }
  }, [isConnected, connect, selectedNetworkInfo]);

  const wallet: Wallet | undefined = useMemo(() => {
    if (!address || !isConnected) return;
    let targetNetworkId = starknetNetwork.id;

    if (selectedNetworkInfo?.kind === NetworkKind.Starknet) {
      targetNetworkId = selectedNetworkInfo.id;
    }
    const userId = getUserId(targetNetworkId, address);
    const walletId = `argentX-${address}`;
    const wallet: Wallet = {
      id: walletId,
      address,
      provider: WalletProvider.ArgentX,
      networkKind: NetworkKind.Starknet,
      networkId: targetNetworkId,
      userId,
      connected: isConnected,
    };
    return wallet;
  }, [address, isConnected, selectedNetworkInfo]);

  useEffect(() => {
    if (
      wallet?.connected &&
      selectedNetworkInfo?.kind === NetworkKind.Starknet
    ) {
      dispatch(setSelectedWalletId(wallet.id));
    }
  }, [dispatch, selectedNetworkInfo, wallet]);

  const hasArgentX = useMemo(() => {
    return typeof (window as any).ethereum !== "undefined";
  }, []);

  return hasArgentX
    ? [true, true, wallet ? [wallet] : []]
    : [false, true, undefined];
};

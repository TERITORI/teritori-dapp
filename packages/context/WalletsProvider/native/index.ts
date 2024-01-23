import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { useSelectedNetworkInfo } from "../../../hooks/useSelectedNetwork";
import { getUserId, NetworkKind } from "../../../networks";
import { teritoriNetwork } from "../../../networks/teritori";
import {
  selectINativeWalletConnected,
  selectSelectedWalletId,
  setIsLeapConnected,
} from "../../../store/slices/settings";
import { useAppDispatch } from "../../../store/store";
import { WalletProvider } from "../../../utils/walletProvider";
import { Wallet } from "../wallet";

type UseLeapResult = [true, boolean, Wallet[]] | [false, boolean, undefined];

export const useLeap: () => UseLeapResult = () => {
  const isLeapConnected = useSelector(selectINativeWalletConnected);
  const [hasNative, setHasNative] = useState(false);
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const dispatch = useAppDispatch();

  const [addresses, setAddresses] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const selectedWalletId = useSelector(selectSelectedWalletId);

  const handleLoad = () => {
    // @ts-ignore
    const nativeWallet = window?.leap;
    const hasLeap = !!nativeWallet;
    if (hasLeap) {
      console.log("nativeWallet installed");
    }
    setHasNative(hasLeap);
    if (!hasLeap) {
      setReady(true);
    }
  };

  useEffect(() => {
    window.addEventListener("load", handleLoad);
    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  useEffect(() => {
    handleLoad();
  }, [selectedWalletId]);

  useEffect(() => {
    if (!hasNative) {
      return;
    }
    const handleKeyChange = async () => {
      if (selectedNetworkInfo?.kind !== NetworkKind.Cosmos) {
        return;
      }
      // todo: fix this; not tested at all for Native Wallet
      // @ts-ignore
      const leap = window?.leap;
      if (!leap) {
        console.error("no leap");
        return;
      }
      const offlineSigner = await leap.getOfflineSignerAuto(
        selectedNetworkInfo.chainId,
      );
      const accounts = await offlineSigner.getAccounts();
      setAddresses(
        accounts.map((account: { address: any }) => account.address),
      );
    };
    window.addEventListener("leap_keystorechange", handleKeyChange);
    return () =>
      window.removeEventListener("leap_keystorechange", handleKeyChange);
  }, [hasNative, selectedNetworkInfo]);

  useEffect(() => {
    const effect = async () => {
      if (!hasNative || !isLeapConnected) {
        setReady(true);
        return;
      }

      try {
        // @ts-ignore
        const leap = window?.leap;
        if (!leap) {
          setReady(true);
          console.error("no leap");
          return;
        }
        const targetNetwork =
          selectedNetworkInfo?.kind === NetworkKind.Cosmos
            ? selectedNetworkInfo
            : teritoriNetwork;
        const chainId = targetNetwork.chainId;
        if (!chainId) {
          setReady(true);
          console.error("missing chain id");
          return;
        }
        await leap.enable(chainId);
        const offlineSigner = await leap.getOfflineSignerAuto(chainId);
        const accounts = await offlineSigner.getAccounts();
        setAddresses(
          accounts.map((account: { address: any }) => account.address),
        );
      } catch (err) {
        console.warn("failed to connect to leap", err);
        dispatch(setIsLeapConnected(false));
      }

      setReady(true);
    };
    effect();
  }, [hasNative, isLeapConnected, dispatch, selectedNetworkInfo]);

  const wallets = useMemo(() => {
    let networkId = teritoriNetwork.id;
    if (selectedNetworkInfo?.kind === NetworkKind.Cosmos) {
      networkId = selectedNetworkInfo.id;
    }

    if (addresses.length === 0) {
      const wallet: Wallet = {
        address: "",
        provider: WalletProvider.Native,
        networkKind: NetworkKind.Cosmos,
        networkId,
        userId: "",
        connected: false,
        id: `native`,
      };
      return [wallet];
    }
    return addresses.map((address, index) => {
      const userId = getUserId(networkId, address);

      const wallet: Wallet = {
        address,
        provider: WalletProvider.Native,
        networkKind: NetworkKind.Cosmos,
        networkId,
        userId,
        connected: true,
        id: `native-${address}`,
      };

      return wallet;
    });
  }, [addresses, selectedNetworkInfo]);

  return hasNative ? [true, ready, wallets] : [false, ready, undefined];
};

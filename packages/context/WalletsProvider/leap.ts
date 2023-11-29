import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { useSelectedNetworkInfo } from "./../../hooks/useSelectedNetwork";
import { Wallet } from "./wallet";
import { NetworkKind, getUserId } from "../../networks";
import { teritoriNetwork } from "../../networks/teritori";
import {
  selectIsLeapConnected,
  selectSelectedWalletId,
  setIsLeapConnected,
} from "../../store/slices/settings";
import { useAppDispatch } from "../../store/store";
import { WalletProvider } from "../../utils/walletProvider";

type UseLeapResult = [true, boolean, Wallet[]] | [false, boolean, undefined];

export const useLeap: () => UseLeapResult = () => {
  const isLeapConnected = useSelector(selectIsLeapConnected);
  const [hasLeap, setHasLeap] = useState(false);
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const dispatch = useAppDispatch();

  const [addresses, setAddresses] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const selectedWalletId = useSelector(selectSelectedWalletId);

  const handleLoad = () => {
    // @ts-ignore
    const leap = window?.leap;
    const hasLeap = !!leap;
    if (hasLeap) {
      console.log("leap installed");
    }
    setHasLeap(hasLeap);
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
    if (!hasLeap) {
      return;
    }
    const handleKeyChange = async () => {
      if (selectedNetworkInfo?.kind !== NetworkKind.Cosmos) {
        return;
      }
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
  }, [hasLeap, selectedNetworkInfo]);

  useEffect(() => {
    const effect = async () => {
      if (!hasLeap || !isLeapConnected) {
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
  }, [hasLeap, isLeapConnected, dispatch, selectedNetworkInfo]);

  const wallets = useMemo(() => {
    let networkId = teritoriNetwork.id;
    if (selectedNetworkInfo?.kind === NetworkKind.Cosmos) {
      networkId = selectedNetworkInfo.id;
    }

    if (addresses.length === 0) {
      const wallet: Wallet = {
        address: "",
        provider: WalletProvider.Leap,
        networkKind: NetworkKind.Cosmos,
        networkId,
        userId: "",
        connected: false,
        id: `leap`,
      };
      return [wallet];
    }
    const wallets = addresses.map((address, index) => {
      const userId = getUserId(networkId, address);

      const wallet: Wallet = {
        address,
        provider: WalletProvider.Leap,
        networkKind: NetworkKind.Cosmos,
        networkId,
        userId,
        connected: true,
        id: `leap-${address}`,
      };

      return wallet;
    });

    return wallets;
  }, [addresses, selectedNetworkInfo]);

  return hasLeap ? [true, ready, wallets] : [false, ready, undefined];
};

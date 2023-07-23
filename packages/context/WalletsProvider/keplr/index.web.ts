import { Window as KeplrWindow } from "@keplr-wallet/types";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { useSelectedNetworkInfo } from "../../../hooks/useSelectedNetwork";
import { NetworkKind, getUserId } from "../../../networks";
import {
  selectIsKeplrConnected,
  setIsKeplrConnected,
  setSelectedWalletId,
} from "../../../store/slices/settings";
import { useAppDispatch } from "../../../store/store";
import { WalletProvider } from "../../../utils/walletProvider";
import { Wallet } from "../wallet";

export type UseKeplrResult =
  | [true, boolean, Wallet[]]
  | [false, boolean, undefined];

export const useKeplr: () => UseKeplrResult = () => {
  const isKeplrConnected = useSelector(selectIsKeplrConnected);
  const [hasKeplr, setHasKeplr] = useState(false);
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const dispatch = useAppDispatch();

  const [addresses, setAddresses] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const handleLoad = () => {
      const keplr = (window as KeplrWindow)?.keplr;
      const hasKeplr = !!keplr;
      if (hasKeplr) {
        console.log("keplr installed");
      }
      setHasKeplr(hasKeplr);
      if (!hasKeplr) {
        setReady(true);
      }
    };
    window.addEventListener("load", handleLoad);
    return () => window.removeEventListener("load", handleLoad);
  }, []);

  useEffect(() => {
    if (!hasKeplr) {
      return;
    }
    const handleKeyChange = async () => {
      if (selectedNetworkInfo?.kind !== NetworkKind.Cosmos) {
        return;
      }
      const keplr = (window as KeplrWindow)?.keplr;
      if (!keplr) {
        console.error("no keplr");
        return;
      }
      const offlineSigner = await keplr.getOfflineSignerAuto(
        selectedNetworkInfo.chainId
      );
      const accounts = await offlineSigner.getAccounts();
      setAddresses(accounts.map((account) => account.address));
    };
    window.addEventListener("keplr_keystorechange", handleKeyChange);
    return () =>
      window.removeEventListener("keplr_keystorechange", handleKeyChange);
  }, [hasKeplr, selectedNetworkInfo]);

  useEffect(() => {
    const effect = async () => {
      if (!hasKeplr || !isKeplrConnected) {
        setReady(true);
        return;
      }
      try {
        const keplr = (window as KeplrWindow)?.keplr;
        if (!keplr) {
          setReady(true);
          console.error("no keplr");
          return;
        }
        if (selectedNetworkInfo?.kind !== NetworkKind.Cosmos) {
          setReady(true);
          return;
        }
        const chainId = selectedNetworkInfo.chainId;
        if (!chainId) {
          setReady(true);
          console.error("missing chain id");
          return;
        }
        await keplr.enable(chainId);
        const offlineSigner = await keplr.getOfflineSignerAuto(chainId);
        const accounts = await offlineSigner.getAccounts();
        setAddresses(accounts.map((account) => account.address));
      } catch (err) {
        console.warn("failed to connect to keplr", err);
        dispatch(setIsKeplrConnected(false));
      }

      setReady(true);
    };
    effect();
  }, [hasKeplr, isKeplrConnected, dispatch, selectedNetworkInfo]);

  const wallets = useMemo(() => {
    let networkId = "";
    if (selectedNetworkInfo?.kind === NetworkKind.Cosmos) {
      networkId = selectedNetworkInfo.id;
    }

    if (addresses.length === 0) {
      const wallet: Wallet = {
        address: "",
        provider: WalletProvider.Keplr,
        networkKind: NetworkKind.Cosmos,
        networkId,
        userId: "",
        connected: false,
        id: `keplr`,
      };
      return [wallet];
    }
    const wallets = addresses.map((address, index) => {
      let userId = "";
      if (selectedNetworkInfo?.kind === NetworkKind.Cosmos) {
        userId = getUserId(networkId, address);
      }

      const wallet: Wallet = {
        address,
        provider: WalletProvider.Keplr,
        networkKind: NetworkKind.Cosmos,
        networkId,
        userId,
        connected: true,
        id: `keplr-${address}`,
      };
      console.log("keplr", index, wallet);
      return wallet;
    });

    return wallets;
  }, [addresses, selectedNetworkInfo]);

  useEffect(() => {
    const selectedWallet = wallets.find((w) => w.connected);
    if (selectedWallet && selectedNetworkInfo?.kind === NetworkKind.Cosmos) {
      dispatch(setSelectedWalletId(selectedWallet.id));
    }
  }, [dispatch, selectedNetworkInfo?.kind, wallets]);

  return hasKeplr ? [true, ready, wallets] : [false, ready, undefined];
};

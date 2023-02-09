import { Window as KeplrWindow } from "@keplr-wallet/types";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import {
  selectIsKeplrConnected,
  setIsKeplrConnected,
  setSelectedWalletId,
} from "../../store/slices/settings";
import { useAppDispatch } from "../../store/store";
import { Network } from "../../utils/network";
import { teritoriChainId } from "../../utils/teritori";
import { WalletProvider } from "../../utils/walletProvider";
import { useSelectedNetworkInfo } from "./../../hooks/useSelectedNetwork";
import { Wallet } from "./wallet";

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
      if (!teritoriChainId) {
        console.error("no teritori chain id");
        return;
      }
      const keplr = (window as KeplrWindow)?.keplr;
      if (!keplr) {
        console.error("no keplr");
        return;
      }
      const offlineSigner = await keplr.getOfflineSignerAuto(teritoriChainId);
      const accounts = await offlineSigner.getAccounts();
      setAddresses(accounts.map((account) => account.address));
    };
    window.addEventListener("keplr_keystorechange", handleKeyChange);
    return () =>
      window.removeEventListener("keplr_keystorechange", handleKeyChange);
  }, [hasKeplr]);

  useEffect(() => {
    const effect = async () => {
      if (!hasKeplr || !isKeplrConnected) {
        return;
      }

      try {
        const keplr = (window as KeplrWindow)?.keplr;
        if (!keplr) {
          console.error("no keplr");
          return;
        }
        const chainId = teritoriChainId;
        if (!chainId) {
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
  }, [hasKeplr, isKeplrConnected, dispatch]);

  /*
  useEffect(() => {
    addresses.forEach((address) => {
      if (!address) {
        return;
      }
      dispatch(
        addWallet({
          publicKey: address,
          network: Network.Teritori,
        })
      );
    });
  }, [addresses]);
  */

  const wallets = useMemo(() => {
    if (addresses.length === 0) {
      const wallet: Wallet = {
        address: "",
        provider: WalletProvider.Keplr,
        connected: false,
        id: `keplr`,
      };
      return [wallet];
    }
    const wallets = addresses.map((address, index) => {
      const wallet: Wallet = {
        address,
        provider: WalletProvider.Keplr,
        connected: true,
        id: `keplr-${address}`,
      };
      console.log("keplr", index, wallet);
      return wallet;
    });

    const selectedWallet = wallets.find((w) => w.connected);
    if (selectedWallet && selectedNetworkInfo?.network === Network.Teritori) {
      dispatch(setSelectedWalletId(selectedWallet.id));
    }

    return wallets;
  }, [addresses, dispatch, selectedNetworkInfo?.network]);

  return hasKeplr ? [true, ready, wallets] : [false, ready, undefined];
};

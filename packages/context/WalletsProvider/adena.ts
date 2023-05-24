import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { Wallet } from "./wallet";
import { useSelectedNetworkInfo } from "../../hooks/useSelectedNetwork";
import { NetworkKind, getUserId } from "../../networks";
import { gnoTestnetNetwork } from "../../networks/gno-testnet";
import {
  selectIsAdenaConnected,
  setIsAdenaConnected,
  setSelectedWalletId,
} from "../../store/slices/settings";
import { useAppDispatch } from "../../store/store";
import { WalletProvider } from "../../utils/walletProvider";

export type UseAdenaResult =
  | [true, boolean, Wallet[]]
  | [false, boolean, undefined];

export const useAdena: () => UseAdenaResult = () => {
  const isAdenaConnected = useSelector(selectIsAdenaConnected);
  const [hasAdena, setHasAdena] = useState(false);
  const dispatch = useAppDispatch();
  const selectedNetworkInfo = useSelectedNetworkInfo();

  const [addresses, setAddresses] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const handleLoad = () => {
      const adena = (window as any)?.adena;
      const hasAdena = !!adena;
      if (hasAdena) {
        console.log("adena installed");
      }
      setHasAdena(hasAdena);
      if (!hasAdena) {
        setReady(true);
      }
    };
    window.addEventListener("load", handleLoad);
    return () => window.removeEventListener("load", handleLoad);
  }, []);

  useEffect(() => {
    const effect = async () => {
      if (!hasAdena || !isAdenaConnected) {
        return;
      }
      try {
        const adena = (window as any)?.adena;
        if (!adena) {
          console.error("no adena");
          return;
        }
        const account = await adena.GetAccount();
        if (!account.data.address) {
          throw new Error("no address");
        }
        setAddresses([account.data.address]);
      } catch (err) {
        console.warn("failed to connect to adena", err);
        dispatch(setIsAdenaConnected(false));
      }

      setReady(true);
    };
    effect();
  }, [dispatch, hasAdena, isAdenaConnected]);

  const wallets = useMemo(() => {
    const networkId = gnoTestnetNetwork.id;

    if (addresses.length === 0) {
      const wallet: Wallet = {
        address: "",
        provider: WalletProvider.Adena,
        networkKind: NetworkKind.Gno,
        networkId,
        userId: "",
        connected: false,
        id: `adena`,
      };
      return [wallet];
    }
    const wallets = addresses.map((address, index) => {
      const wallet: Wallet = {
        address,
        provider: WalletProvider.Adena,
        networkKind: NetworkKind.Gno,
        networkId,
        userId: getUserId(networkId, address),
        connected: true,
        id: `adena-${address}`,
      };
      return wallet;
    });

    return wallets;
  }, [addresses]);

  useEffect(() => {
    const selectedWallet = wallets.find((w) => w.connected);
    if (selectedWallet && selectedNetworkInfo?.kind === NetworkKind.Gno) {
      dispatch(setSelectedWalletId(selectedWallet.id));
    }
  }, [dispatch, selectedNetworkInfo?.kind, wallets]);

  return hasAdena ? [true, ready, wallets] : [false, ready, undefined];
};

import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { useSelectedNetworkInfo } from "./../../hooks/useSelectedNetwork";
import { Wallet } from "./wallet";
import { NetworkKind, getUserId } from "../../networks";
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
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const dispatch = useAppDispatch();

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
        if (selectedNetworkInfo?.kind !== NetworkKind.Gno) {
          return;
        }
        const account = await adena.GetAccount();
        setAddresses([account.data.address]);
      } catch (err) {
        console.warn("failed to connect to adena", err);
        dispatch(setIsAdenaConnected(false));
      }

      setReady(true);
    };
    effect();
  }, [hasAdena, isAdenaConnected, dispatch, selectedNetworkInfo]);

  const wallets = useMemo(() => {
    let networkId = "";
    if (selectedNetworkInfo?.kind === NetworkKind.Gno) {
      networkId = selectedNetworkInfo.id;
    }

    if (addresses.length === 0) {
      const wallet: Wallet = {
        address: "",
        provider: WalletProvider.Adena,
        networkKind: NetworkKind.Gno,
        networkId,
        userId: "",
        connected: false,
        id: `gno`,
      };
      return [wallet];
    }
    const wallets = addresses.map((address, index) => {
      let userId = "";
      if (selectedNetworkInfo?.kind === NetworkKind.Gno) {
        userId = getUserId(networkId, address);
      }

      const wallet: Wallet = {
        address,
        provider: WalletProvider.Adena,
        networkKind: NetworkKind.Gno,
        networkId,
        userId,
        connected: true,
        id: `gno-${address}`,
      };
      console.log("gno", index, wallet);
      return wallet;
    });

    const selectedWallet = wallets.find((w) => w.connected);
    if (selectedWallet && selectedNetworkInfo?.kind === NetworkKind.Gno) {
      dispatch(setSelectedWalletId(selectedWallet.id));
    }

    return wallets;
  }, [addresses, dispatch, selectedNetworkInfo]);

  return hasAdena ? [true, ready, wallets] : [false, ready, undefined];
};

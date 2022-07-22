import { Window as KeplrWindow } from "@keplr-wallet/types";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import {
  selectIsKeplrConnected,
  setIsKeplrConnected,
} from "../../store/slices/settings";
import { addWallet } from "../../store/slices/wallets";
import { useAppDispatch } from "../../store/store";
import { Network } from "../../utils/network";
import { teritoriChainId } from "../../utils/teritori";
import { WalletProvider } from "../../utils/walletProvider";
import { Wallet } from "./wallet";

export type UseKeplrResult =
  | [true, boolean, Wallet[]]
  | [false, true, undefined];

export const useKeplr: () => UseKeplrResult = () => {
  const isKeplrConnected = useSelector(selectIsKeplrConnected);
  const dispatch = useAppDispatch();
  const keplr = (window as KeplrWindow)?.keplr;
  const hasKeplr = !!keplr;

  const [addresses, setAddresses] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const effect = async () => {
      if (!hasKeplr || !isKeplrConnected) {
        return;
      }
      try {
        const chainId = teritoriChainId;
        await keplr.enable(chainId);
        const offlineSigner = keplr.getOfflineSigner(chainId);
        const accounts = await offlineSigner.getAccounts();
        setAddresses(accounts.map((account) => account.address));
      } catch (err) {
        console.warn("failed to connect to keplr", err);
        dispatch(setIsKeplrConnected(false));
      }
      setReady(true);
    };
    effect();
  }, [isKeplrConnected, dispatch]);

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

  const wallets = useMemo(() => {
    if (addresses.length === 0) {
      const wallet: Wallet = {
        publicKey: "",
        provider: WalletProvider.Keplr,
        network: Network.Teritori,
        connected: false,
        id: `keplr`,
      };
      return [wallet];
    }
    return addresses.map((address, index) => {
      const wallet: Wallet = {
        publicKey: address,
        provider: WalletProvider.Keplr,
        network: Network.Teritori,
        connected: true,
        id: `keplr-${address}`,
      };
      console.log("keplr", index, wallet);
      return wallet;
    });
  }, [addresses]);

  return hasKeplr ? [true, ready, wallets] : [false, true, undefined];
};

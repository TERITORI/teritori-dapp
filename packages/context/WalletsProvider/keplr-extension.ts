import { AccountData } from "@cosmjs/proto-signing";
import { Window as KeplrWindow } from "@keplr-wallet/types";
import { bech32 } from "bech32";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { UseWalletProviderResult } from "./types";
import { Wallet } from "./wallet";
import { useSelectedNetworkInfo } from "../../hooks/useSelectedNetwork";
import { NetworkKind, allNetworks, getUserId } from "../../networks";
import {
  selectIsKeplrConnected,
  setIsKeplrConnected,
} from "../../store/slices/settings";
import { useAppDispatch } from "../../store/store";
import { WalletProvider } from "../../utils/walletProvider";

export const useKeplrExtensionWallets: () => UseWalletProviderResult = () => {
  const isKeplrConnected = useSelector(selectIsKeplrConnected);
  const [hasKeplr, setHasKeplr] = useState(false);
  const dispatch = useAppDispatch();
  const selectedNetworkInfo = useSelectedNetworkInfo();

  const [accounts, setAccounts] = useState<readonly AccountData[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const handleLoad = () => {
      const keplr = (window as KeplrWindow)?.keplr;
      const hasKeplr = !!keplr;
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
      setAccounts(accounts);
    };
    window.addEventListener("keplr_keystorechange", handleKeyChange);
    return () =>
      window.removeEventListener("keplr_keystorechange", handleKeyChange);
  }, [hasKeplr, selectedNetworkInfo]);

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
        if (selectedNetworkInfo?.kind !== NetworkKind.Cosmos) {
          return;
        }
        const chainId = selectedNetworkInfo.chainId;
        if (!chainId) {
          console.error("missing chain id");
          return;
        }
        await keplr.enable(chainId);
        const offlineSigner = await keplr.getOfflineSignerAuto(chainId);
        const accounts = await offlineSigner.getAccounts();
        setAccounts(accounts);
      } catch (err) {
        console.warn("failed to connect to keplr", err);
        dispatch(setIsKeplrConnected(false));
      }

      setReady(true);
    };
    effect();
  }, [hasKeplr, isKeplrConnected, dispatch, selectedNetworkInfo]);

  const wallets = useMemo(() => {
    if (accounts.length === 0) {
      return [];
    }
    const wallets = accounts.reduce((wallets, account, index) => {
      const newWallets: Wallet[] = [];

      for (const network of allNetworks) {
        if (network.kind !== NetworkKind.Cosmos) {
          continue;
        }

        const address = bech32.encode(
          network.addressPrefix,
          bech32.decode(account.address).words
        );

        const userId = getUserId(network.id, address);

        const wallet: Wallet = {
          address,
          provider: WalletProvider.Keplr,
          networkKind: NetworkKind.Cosmos,
          networkId: network.id,
          userId,
          connected: true,
          id: `keplr-${network.id}-${address}`,
        };
        newWallets.push(wallet);
      }

      return [...wallets, ...newWallets];
    }, [] as Wallet[]);

    return wallets;
  }, [accounts]);

  return useMemo(() => {
    return {
      hasProvider: hasKeplr,
      ready,
      wallets,
      providerKind: WalletProvider.Keplr,
    };
  }, [hasKeplr, ready, wallets]);
};

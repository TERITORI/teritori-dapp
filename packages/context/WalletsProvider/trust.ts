import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { useSelectedNetworkInfo } from "./../../hooks/useSelectedNetwork";
import { Wallet } from "./wallet";
import { NetworkKind, getUserId } from "../../networks";
import {
  selectIsTrustWalletConnected,
  setIsTrustWalletConnected,
  setSelectedWalletId,
} from "../../store/slices/settings";
import { useAppDispatch } from "../../store/store";
import { WalletProvider } from "../../utils/walletProvider";

export type UseTrustResult =
  | [true, boolean, Wallet[]]
  | [false, boolean, undefined];

export const useTrust: () => UseTrustResult = () => {
  const isTrustConnected = useSelector(selectIsTrustWalletConnected);
  const [ready, setReady] = useState(false);
  const [addresses, setAddresses] = useState<string[]>([]);
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const effect = async () => {
      if (!isTrustConnected) {
        return;
      }
      const getTrustWalletInjectedProvider = async (
        { timeout } = { timeout: 3000 }
      ) => {
        const provider = getTrustWalletFromWindow();
        if (provider) {
          return provider;
        }
        return listenForTrustWalletInitialized({ timeout });
      };
      const listenForTrustWalletInitialized = async (
        { timeout } = { timeout: 3000 }
      ) => {
        return new Promise((resolve) => {
          const handleInitialization = () => {
            resolve(getTrustWalletFromWindow());
          };
          window.addEventListener(
            "trustwallet#initialized",
            handleInitialization,
            {
              once: true,
            }
          );
          setTimeout(() => {
            window.removeEventListener(
              "trustwallet#initialized",
              handleInitialization
            );
            resolve(null);
          }, timeout);
        });
      };
      const getTrustWalletFromWindow = () => {
        const isTrustWallet = (ethereum: any) => {
          const trustWallet = !!ethereum.isTrust;
          return trustWallet;
        };
        const injectedProviderExist =
          typeof window !== "undefined" &&
          typeof (window as any).ethereum !== "undefined";
        // No injected providers exist.
        if (!injectedProviderExist) {
          return null;
        }
        // Trust Wallet was injected into window.ethereum.
        if (isTrustWallet((window as any).ethereum)) {
          return (window as any).ethereum;
        }
        // Trust Wallet provider might be replaced by another
        // injected provider, check the providers array.
        if ((window as any).ethereum?.providers) {
          // ethereum.providers array is a non-standard way to
          // preserve multiple injected providers. Eventually, EIP-5749
          // will become a living standard and we will have to update this.
          return (window as any).ethereum.providers.find(isTrustWallet) ?? null;
        }
        // Trust Wallet injected provider is available in the global scope.
        // There are cases that some cases injected providers can replace window.ethereum
        // without updating the ethereum.providers array. To prevent issues where
        // the TW connector does not recognize the provider when TW extension is installed,
        // we begin our checks by relying on TW's global object.
        return (window as any)["trustwallet"] ?? null;
      };

      try {
        const injectedProvider = await getTrustWalletInjectedProvider();
        const accounts = await injectedProvider.request({
          method: "eth_requestAccounts",
        });
        if (!accounts) {
          throw new Error("no address");
        }
        setAddresses(accounts);
      } catch (err) {
        console.warn("failed to connect to adena", err);
        dispatch(setIsTrustWalletConnected(false));
      }
      setReady(true);
    };
    effect();
  }, [dispatch, isTrustConnected]);

  const wallets = useMemo(() => {
    let networkId = "";
    if (selectedNetworkInfo?.kind === NetworkKind.Ethereum) {
      networkId = selectedNetworkInfo.id;
    }
    if (addresses.length === 0) {
      const wallet: Wallet = {
        address: "",
        provider: WalletProvider.Trust,
        networkKind: NetworkKind.Ethereum,
        networkId,
        userId: "",
        connected: false,
        id: `trust`,
      };
      return [wallet];
    }
    const wallets = addresses.map((address, index) => {
      const wallet: Wallet = {
        address,
        provider: WalletProvider.Trust,
        networkKind: NetworkKind.Ethereum,
        networkId,
        userId: getUserId(networkId, address),
        connected: true,
        id: `trust-${address}`,
      };
      return wallet;
    });

    return wallets;
  }, [addresses, selectedNetworkInfo]);

  useEffect(() => {
    const selectedWallet = wallets.find((w) => w.connected);
    if (selectedWallet && selectedNetworkInfo?.kind === NetworkKind.Ethereum) {
      dispatch(setSelectedWalletId(selectedWallet.id));
    }
  }, [dispatch, selectedNetworkInfo?.kind, wallets]);

  return isTrustConnected ? [true, ready, wallets] : [false, ready, undefined];
};

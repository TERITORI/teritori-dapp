import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSelector } from "react-redux";

import {
  addWallet,
  selectStoreWallets,
  storeWalletId,
} from "../store/slices/wallets";
import { useAppDispatch } from "../store/store";
import { Network } from "../utils/network";
import { WalletProvider } from "../utils/walletProvider";

export interface Wallet {
  id: string;
  publicKey: string;
  provider: WalletProvider;
  connected: boolean;
  network: Network;
}

type UsePhantomResult = [true, boolean, Wallet] | [false, true, undefined];

const usePhantom: () => UsePhantomResult = () => {
  const phantom = (window as any)?.solana;
  const hasPhantom = !!phantom?.isPhantom;

  const [publicKey, setPublicKey] = useState("");
  const [ready, setReady] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("hasPhantom", hasPhantom);

    if (!hasPhantom) {
      return;
    }

    console.log("phantom installed");

    const handleConnect = (pk) => {
      console.log("phantom connected");
      if (!pk) {
        return;
      }
      setPublicKey(pk.toBase58());
    };
    phantom.on("connect", handleConnect);

    const handleDisconnect = (pk) => {
      console.log("phantom disconnected");
      setPublicKey("");
    };
    phantom.on("disconnect", handleDisconnect);

    const handleAccountChanged = async (pk) => {
      console.log("phantom account changed");
      setPublicKey("");
    };
    phantom.on("accountChanged", handleAccountChanged);

    return () => {
      phantom.off("connect", handleConnect);
      phantom.off("disconnect", handleDisconnect);
      phantom.off("accountChanged", handleAccountChanged);
    };
  }, []);

  useEffect(() => {
    const effect = async () => {
      if (!hasPhantom) {
        return;
      }
      try {
        await phantom.connect({ onlyIfTrusted: true });
      } catch {}
      setReady(true);
    };
    effect();
  }, []);

  const wallet = useMemo(() => {
    const wallet: Wallet = {
      publicKey,
      provider: WalletProvider.Phantom,
      network: Network.Solana,
      connected: !!publicKey,
      id: "phantom",
    };
    console.log("phantom", wallet);
    return wallet;
  }, [publicKey]);

  useEffect(() => {
    if (!wallet.publicKey) {
      return;
    }
    dispatch(
      addWallet({
        publicKey: wallet.publicKey,
        network: wallet.network,
      })
    );
  }, [wallet]);

  return hasPhantom ? [true, ready, wallet] : [false, true, undefined];
};

type WalletsContextValue = {
  wallets: Wallet[];
  ready: boolean;
};

const WalletsContext = createContext<WalletsContextValue>({
  wallets: [],
  ready: false,
});

export const useWallets = () => useContext(WalletsContext);

export const WalletsProvider: React.FC = React.memo(({ children }) => {
  const [hasPhantom, phantomIsReady, phantomWallet]: UsePhantomResult =
    usePhantom();

  const storeWallets = useSelector(selectStoreWallets);

  const value = useMemo(() => {
    const wallets = storeWallets.map((storeWallet) => {
      const wallet: Wallet = {
        id: storeWalletId(storeWallet),
        publicKey: storeWallet.publicKey,
        network: storeWallet.network,
        provider: WalletProvider.Store,
        connected: false,
      };
      return wallet;
    });

    if (hasPhantom) {
      const storePhantomWalletIndex = wallets.findIndex(
        (wallet) =>
          wallet.network === phantomWallet.network &&
          wallet.publicKey === phantomWallet.publicKey
      );
      if (storePhantomWalletIndex !== -1) {
        wallets[storePhantomWalletIndex].provider = WalletProvider.Phantom;
        wallets[storePhantomWalletIndex].connected = phantomWallet.connected;
      } else {
        wallets.unshift(phantomWallet);
      }
    }

    return {
      wallets,
      ready: phantomIsReady,
    };
  }, [hasPhantom, phantomIsReady, phantomWallet, storeWallets]);

  return (
    <WalletsContext.Provider value={value}>{children}</WalletsContext.Provider>
  );
});

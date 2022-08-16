import React, {createContext, useContext, useMemo, useState} from "react"
import { useSelector } from "react-redux";

import { selectStoreWallets, storeWalletId } from "../../store/slices/wallets";
import { WalletProvider } from "../../utils/walletProvider";
import { useKeplr } from "./keplr";
import { usePhantom } from "./phantom";
import { Wallet } from "./wallet";

/**
 * FIXME: We should change the architecture of this and split "wallets addresses"
 * from "wallets providers" instead of having the Wallet type to represent both
 */

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
  const [hasPhantom, phantomIsReady, phantomWallet] = usePhantom();
  const [hasKeplr, keplrIsReady, keplrWallets] = useKeplr();

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

    if (hasKeplr) {
      if (keplrWallets.length === 1 && !keplrWallets[0].connected) {
        wallets.unshift(keplrWallets[0]);
      } else {
        keplrWallets.forEach((wallet) => {
          const storeWalletIndex = wallets.findIndex(
            (storeWallet) =>
              wallet.network === storeWallet.network &&
              wallet.publicKey === storeWallet.publicKey
          );
          if (storeWalletIndex !== -1) {
            wallets[storeWalletIndex].provider = WalletProvider.Keplr;
            wallets[storeWalletIndex].connected = wallet.connected;
          }
        });
      }
    }

    return {
      wallets,
      ready: phantomIsReady && keplrIsReady,
    };
  }, [
    hasPhantom,
    phantomIsReady,
    phantomWallet,
    hasKeplr,
    keplrIsReady,
    keplrWallets,
    storeWallets,
  ]);

  return (
    <WalletsContext.Provider value={value}>{children}</WalletsContext.Provider>
  );
});

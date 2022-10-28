import React, { createContext, useContext, useMemo } from "react";
// import { useSelector } from "react-redux";

import { WalletProvider } from "../../utils/walletProvider";
import { useKeplr } from "./keplr";
import { Wallet } from "./wallet";
// import { usePhantom } from "./phantom";
// import { selectStoreWallets, storeWalletId } from "../../store/slices/wallets";
// import { WalletProvider } from "../../utils/walletProvider";

/**
 * FIXME: We should change the architecture of this and split "wallets addresses"
 * from "wallets providers" instead of having the Wallet type to represent both
 */

type WalletsContextValue = {
  wallets: Wallet[];
  walletProviders: WalletProvider[];
  ready: boolean;
};

const WalletsContext = createContext<WalletsContextValue>({
  wallets: [],
  walletProviders: [],
  ready: false,
});

/*
 * We temprorarily only support keplr when it's conencted and return only the first keplr address
 */

export const useWallets = () => useContext(WalletsContext);

export const WalletsProvider: React.FC = React.memo(({ children }) => {
  // const [hasPhantom, phantomIsReady, phantomWallet] = usePhantom();
  const [hasKeplr, keplrIsReady, keplrWallets] = useKeplr();

  // const storeWallets = useSelector(selectStoreWallets);

  const value = useMemo(() => {
    const wallets: Wallet[] = [];

    /*
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
    */

    /*
    if (hasPhantom && phantomWallet) {
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
    */

    /*
    if (hasKeplr && keplrWallets) {
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
    */

    const walletProviders: WalletProvider[] = [];

    if (hasKeplr) {
      walletProviders.push(WalletProvider.Keplr);
    }

    if (
      hasKeplr &&
      keplrWallets &&
      keplrWallets.length &&
      keplrWallets[0].connected
    ) {
      const wallet = keplrWallets[0];
      wallets.push({
        id: wallet.id,
        address: wallet.address,
        provider: WalletProvider.Keplr,
        connected: true,
      });
    }

    return {
      wallets,
      walletProviders,
      ready: /* phantomIsReady && */ keplrIsReady,
    };
  }, [
    // hasPhantom,
    // phantomIsReady,
    // phantomWallet,
    hasKeplr,
    keplrIsReady,
    keplrWallets,
    // storeWallets,
  ]);

  return (
    <WalletsContext.Provider value={value}>{children}</WalletsContext.Provider>
  );
});

import React, { createContext, useContext, useMemo } from "react";

import { useAdena } from "./adena";
import { useKeplr } from "./keplr";
import { useMetamask } from "./metamask";
import { useTrust } from "./trust";
import { Wallet } from "./wallet";
import { WalletProvider } from "../../utils/walletProvider";
// import { usePhantom } from "./phantom";
// import { selectStoreWallets, storeWalletId } from "../../store/slices/wallets";
// import { WalletProvider } from "../../utils/walletProvider";

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

export const useWallets = () => useContext(WalletsContext);

export const WalletsProvider: React.FC = React.memo(({ children }) => {
  // const [hasPhantom, phantomIsReady, phantomWallet] = usePhantom();
  const [hasKeplr, keplrIsReady, keplrWallets] = useKeplr();
  const [hasMetamask, metamaskIsReady, metamaskWallets] = useMetamask();
  const [hasAdena, adenaIsReady, adenaWallets] = useAdena();
  const [hasTrust, trustIsReady, trustWallets] = useTrust();
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

      if (keplrWallets?.[0]?.connected) {
        wallets.push(keplrWallets[0]);
      }
    }

    if (hasMetamask) {
      walletProviders.push(WalletProvider.Metamask);

      if (metamaskWallets?.[0]?.connected) {
        wallets.push(metamaskWallets[0]);
      }
    }

    if (hasAdena) {
      walletProviders.push(WalletProvider.Adena);
      if (adenaWallets?.[0]?.connected) {
        wallets.push(adenaWallets[0]);
      }
    }
    if (hasTrust) {
      walletProviders.push(WalletProvider.Trust);
      if (trustWallets?.[0]?.connected) {
        wallets.push(trustWallets[0]);
      }
    }
    return {
      wallets,
      walletProviders,
      ready: keplrIsReady && metamaskIsReady && adenaIsReady && trustIsReady,
    };
  }, [
    // hasPhantom,
    // phantomIsReady,
    // phantomWallet,
    hasKeplr,
    keplrIsReady,
    keplrWallets,
    hasMetamask,
    metamaskIsReady,
    metamaskWallets,
    hasAdena,
    adenaIsReady,
    adenaWallets,
    hasTrust,
    trustIsReady,
    trustWallets,
    // storeWallets,
  ]);

  return (
    <WalletsContext.Provider value={value}>{children}</WalletsContext.Provider>
  );
});

import React, { createContext, useContext, useEffect, useMemo } from "react";

import { useKeplr } from "./keplr";
import { useMetamask } from "./metamask";
import { Wallet } from "./wallet";
import { useWalletConnectWallets } from "./wallet-connect";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { setSelectedWallet } from "../../store/slices/settings";
import { useAppDispatch } from "../../store/store";
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
  const [hasWalletConnect, walletConnectReady, walletConnectWallets] =
    useWalletConnectWallets();
  const selectedWallet = useSelectedWallet();
  const selectedNetworkId = useSelectedNetworkId();
  const dispatch = useAppDispatch();

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

      for (const wallet of keplrWallets) {
        if (wallet.connected) {
          wallets.push(wallet);
        }
      }
    }

    if (hasMetamask) {
      walletProviders.push(WalletProvider.Metamask);

      for (const wallet of metamaskWallets) {
        if (wallet.connected) {
          wallets.push(wallet);
        }
      }
    }

    if (hasWalletConnect) {
      walletProviders.push(WalletProvider.WalletConnect);

      for (const wallet of walletConnectWallets) {
        if (wallet.connected) {
          wallets.push(wallet);
        }
      }
    }

    return {
      wallets,
      walletProviders,
      ready: keplrIsReady && metamaskIsReady && walletConnectReady,
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
    hasWalletConnect,
    walletConnectReady,
    walletConnectWallets,
    // storeWallets,
  ]);

  // make sure wallet and network are in sync
  useEffect(() => {
    if (selectedWallet?.networkId !== selectedNetworkId) {
      const wallet = value.wallets.find(
        (w) => w.networkId === selectedNetworkId
      );
      dispatch(setSelectedWallet(wallet));
    }
  }, [dispatch, selectedNetworkId, selectedWallet?.networkId, value.wallets]);

  return (
    <WalletsContext.Provider value={value}>{children}</WalletsContext.Provider>
  );
});

import React, { createContext, useContext, useEffect, useMemo } from "react";

import { useKeplrExtensionWallets } from "./keplr-extension";
import { useMetamaskWallets } from "./metamask";
import { Wallet } from "./wallet";
import { useWalletConnectWallets } from "./wallet-connect";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { setSelectedWallet } from "../../store/slices/settings";
import { WalletProvider } from "../../utils/walletProvider";
// import { usePhantomWallets } from "./phantom";

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
  const keplrExtension = useKeplrExtensionWallets();
  const metamask = useMetamaskWallets();
  const walletConnect = useWalletConnectWallets();
  // const phantom = usePhantomWallets();

  const selectedNetworkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const { wallets } = useWallets();

  const value = useMemo(() => {
    const wallets: Wallet[] = [];
    const providers: Set<WalletProvider> = new Set();

    let ready = true;
    for (const providerInfo of [
      keplrExtension,
      metamask,
      walletConnect /* , phantom */,
    ]) {
      if (!providerInfo.ready) {
        ready = false;
      }

      if (providerInfo.hasProvider) {
        providers.add(providerInfo.providerKind);
        for (const wallet of providerInfo.wallets) {
          if (wallet.connected) {
            wallets.push(wallet);
          }
        }
      }
    }

    return {
      wallets,
      walletProviders: [...providers],
      ready,
    };
  }, [keplrExtension, metamask, walletConnect]);

  // auto-select wallet if none is selected while some are available
  useEffect(() => {
    if (selectedWallet) {
      return;
    }

    const candidate = wallets.find((w) => w.networkId === selectedNetworkId);
    if (!candidate) {
      return;
    }

    setSelectedWallet(candidate);
  }, [selectedNetworkId, selectedWallet, wallets]);

  return (
    <WalletsContext.Provider value={value}>{children}</WalletsContext.Provider>
  );
});

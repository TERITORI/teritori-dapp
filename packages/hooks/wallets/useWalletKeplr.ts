import { Window as KeplrWindow } from "@keplr-wallet/types";

import { useWallet } from "./useWallet";
import { useWalletConnect } from "../../context/WalletConnectProvider";
import { WalletProvider } from "../../utils/walletProvider";

export const useWalletKeplr = (walletId: string | undefined) => {
  const { keplr: walletConnectKeplr } = useWalletConnect();
  const wallet = useWallet(walletId);
  switch (wallet?.provider) {
    case WalletProvider.Keplr: {
      return (window as KeplrWindow).keplr;
    }
    case WalletProvider.WalletConnect: {
      return walletConnectKeplr;
    }
  }
};

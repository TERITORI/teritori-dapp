import { useWallets } from "../context/WalletsProvider";
import { WalletProvider } from "../utils/walletProvider";

export const useHasUserConnectedWallet = () => {
  const { wallets } = useWallets();
  return (
    wallets.filter(
      (wallet) => wallet.connected || wallet.provider === WalletProvider.Store
    ).length > 0
  );
};

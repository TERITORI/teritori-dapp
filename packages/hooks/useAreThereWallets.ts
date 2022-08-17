import { useWallets } from "../context/WalletsProvider";
import { WalletProvider } from "../utils/walletProvider";

export const useAreThereWallets = () => {
  const { wallets } = useWallets();
  return (
    wallets.filter(
      (wallet) => wallet.connected || wallet.provider === WalletProvider.Store
    ).length > 0
  );
};

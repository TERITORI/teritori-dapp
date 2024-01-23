import { useWallets } from "../context/WalletsProvider";
import { WalletProvider } from "../utils/walletProvider";

// Check if the user's wallets contain a Leap wallet
export const useIsNativeWalletConnected = () => {
  const { wallets } = useWallets();
  return !!wallets.find(
    (wallet) => wallet.provider === WalletProvider.Native && wallet.connected,
  );
};

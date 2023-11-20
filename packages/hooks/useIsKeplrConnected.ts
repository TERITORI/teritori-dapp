import { useWallets } from "../context/WalletsProvider";
import { WalletProvider } from "../utils/walletProvider";

// Check if the user's wallets contain a Keplr wallet
export const useIsKeplrConnected = () => {
  const { wallets } = useWallets();
  return !!wallets.find(
    (wallet) => wallet.provider === WalletProvider.Keplr && wallet.connected,
  );
};

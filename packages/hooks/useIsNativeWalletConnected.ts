import { useWallets } from "@/context/WalletsProvider";
import { WalletProvider } from "@/utils/walletProvider";

export const useIsNativeWalletConnected = () => {
  const { wallets } = useWallets();
  return !!wallets.find(
    (wallet) => wallet.provider === WalletProvider.Native && wallet.connected,
  );
};

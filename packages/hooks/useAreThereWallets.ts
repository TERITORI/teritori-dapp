import { useWallets } from "../context/WalletsProvider";
import { walletProviderToNetwork } from "../utils/network";
import { WalletProvider } from "../utils/walletProvider";
import { useSelectedNetworkInfo } from "./useSelectedNetwork";

export const useAreThereWallets = () => {
  const { wallets } = useWallets();
  const selectedNetworkInfo = useSelectedNetworkInfo();

  return (
    wallets.filter(
      (wallet) =>
        (wallet.connected || wallet.provider === WalletProvider.Store) &&
        walletProviderToNetwork(wallet.provider) ===
          selectedNetworkInfo?.network
    ).length > 0
  );
};

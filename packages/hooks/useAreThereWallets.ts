import { useSelectedNetworkId } from "./useSelectedNetwork";
import { useWallets } from "../context/WalletsProvider";
import { WalletProvider } from "../utils/walletProvider";

export const useAreThereWallets = () => {
  const { wallets } = useWallets();
  const selectedNetworkId = useSelectedNetworkId();
  return !!wallets.find(
    (wallet) =>
      (wallet.connected || wallet.provider === WalletProvider.Store) &&
      wallet.networkId === selectedNetworkId,
  );
};

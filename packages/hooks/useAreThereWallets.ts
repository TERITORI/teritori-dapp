import { useWallets } from "../context/WalletsProvider";
import { WalletProvider } from "../utils/walletProvider";
import { useSelectedNetworkId } from "./useSelectedNetwork";

export const useAreThereWallets = () => {
  const { wallets } = useWallets();
  const selectedNetworkId = useSelectedNetworkId();
  return !!wallets.find(
    (wallet) =>
      (wallet.connected || wallet.provider === WalletProvider.Store) &&
      wallet.networkId === selectedNetworkId
  );
};

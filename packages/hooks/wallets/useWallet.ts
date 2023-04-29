import { useWallets } from "../../context/WalletsProvider";

export const useWallet = (walletId: string | undefined) => {
  const { wallets } = useWallets();
  if (!walletId) {
    return undefined;
  }
  return wallets.find((w) => (w.id = walletId));
};

import { useSelector } from "react-redux";

import { useWallets } from "../context/WalletsProvider";
import { selectSelectedWalletId } from "../store/slices/settings";

const useSelectedWallet = () => {
  const { wallets } = useWallets();
  const selectedWalletId = useSelector(selectSelectedWalletId);
  const wallet = wallets.find((wallet) => wallet.id === selectedWalletId);
  if (wallet) {
    return wallet;
  }
  const availableWallets = wallets.filter((wallet) => wallet.publicKey);
  return availableWallets.length > 0 ? availableWallets[0] : undefined;
};

export default useSelectedWallet;

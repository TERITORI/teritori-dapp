import { useSelector } from "react-redux";

import { useWallets } from "../context/WalletsProvider";
import { selectSelectedWalletId } from "../store/slices/settings";

const useSelectedWallet = () => {
  const { wallets, multisignWallet } = useWallets();
  const selectedWalletId = useSelector(selectSelectedWalletId);
  return {
    selectedWallet: wallets.find(
      (w) => w.connected && w.id === selectedWalletId
    ),
    selectedMultisignWallet: multisignWallet,
  };
};

export default useSelectedWallet;

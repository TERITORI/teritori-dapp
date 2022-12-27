import { useSelector } from "react-redux";

import { useWallets } from "../context/WalletsProvider";
import { selectSelectedWalletId } from "../store/slices/settings";

// NOTE: This was returning the actual selected wallet but for
// sake of delivering quickly this now temporarily returns the first connected wallet

const useSelectedWallet = () => {
  const { wallets } = useWallets();
  const selectedWalletId = useSelector(selectSelectedWalletId);

  return wallets.find((w) => w.connected && w.id === selectedWalletId);
};

export default useSelectedWallet;

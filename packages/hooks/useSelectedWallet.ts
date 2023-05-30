import { useSelector } from "react-redux";

import { useWallets } from "../context/WalletsProvider";
import { selectSelectedWalletId } from "../store/slices/settings";

const useSelectedWallet = () => {
  const { wallets } = useWallets();

  const selectedWalletId = useSelector(selectSelectedWalletId);

  return wallets.find((w) => w.id === selectedWalletId);
};

export default useSelectedWallet;

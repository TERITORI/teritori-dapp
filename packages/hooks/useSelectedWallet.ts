import { useSelector } from "react-redux";

import { useWallets } from "@/context/WalletsProvider";
import { selectSelectedWalletId } from "@/store/slices/settings";

const useSelectedWallet = () => {
  const { wallets } = useWallets();
  const selectedWalletId = useSelector(selectSelectedWalletId);

  const selectedWallet = wallets.find(
    (w) => w.connected && w.id === selectedWalletId,
  );

  return selectedWallet;
};

export default useSelectedWallet;

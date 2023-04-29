import { useEffect } from "react";
import { useSelector } from "react-redux";

import { useWallets } from "../context/WalletsProvider";
import { selectSelectedWalletId } from "../store/slices/settings";

const useSelectedWallet = () => {
  const { wallets } = useWallets();

  const selectedWalletId = useSelector(selectSelectedWalletId);

  const wallet = wallets.find((w) => w.connected && w.id === selectedWalletId);

  useEffect(() => {
    console.log("selected wallet id change", wallet?.id);
  }, [wallet?.id]);

  return wallet;
};

export default useSelectedWallet;

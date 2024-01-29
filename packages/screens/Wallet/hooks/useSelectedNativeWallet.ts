import { useSelector } from "react-redux";

import {
  selectSelectedNativeWalletIndex,
  selectWalletById,
} from "../../../store/slices/wallets";
import { RootState } from "../../../store/store";

export const useSelectedNativeWallet = () => {
  const walletId = useSelector(selectSelectedNativeWalletIndex);
  return useSelector((state: RootState) => selectWalletById(state, walletId));
};

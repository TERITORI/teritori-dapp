import { useCallback } from "react";

import useSelectedWallet from "./useSelectedWallet";
import { useWallets } from "../context/WalletsProvider";
import {
  setSelectedNetworkId,
  setSelectedWallet,
} from "../store/slices/settings";
import { useAppDispatch } from "../store/store";

/**
 * set selected network and choose wallet using heuristics
 */
export const useSwitchNetwork = () => {
  const dispatch = useAppDispatch();
  const { wallets } = useWallets();
  const selectedWallet = useSelectedWallet();

  return useCallback(
    (targetNetworkId: string) => {
      // find wallet with same provider as previous
      let targetWallet =
        selectedWallet &&
        wallets.find(
          (w) =>
            w.provider === selectedWallet?.provider &&
            w.networkId === targetNetworkId
        );

      // otherwise find first wallet with correct network id
      if (!targetWallet) {
        targetWallet = wallets.find((w) => w.networkId === targetNetworkId);
      }

      if (targetWallet) {
        dispatch(setSelectedWallet(targetWallet));
      } else {
        dispatch(setSelectedNetworkId(targetNetworkId));
      }
    },
    [dispatch, selectedWallet, wallets]
  );
};

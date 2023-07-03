import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

import { useSelectedNetworkId } from "./useSelectedNetwork";
import { osmosisNetwork } from "../networks/osmosis";
import { osmosisTestnetNetwork } from "../networks/osmosis-testnet";
import { teritoriNetwork } from "../networks/teritori";
import { setSelectedNetworkId } from "../store/slices/settings";
import { useAppDispatch } from "../store/store";
import { useAppRoute } from "../utils/navigation";

export const useForceUnselectNetworks = () => {
  const dispatch = useAppDispatch();
  const { name: currentRouteName } = useAppRoute();
  const selectedNetworkId = useSelectedNetworkId();
  const effect = useCallback(() => {
    if (
      currentRouteName !== "Swap" &&
      (selectedNetworkId === osmosisNetwork.id ||
        selectedNetworkId === osmosisTestnetNetwork.id)
    ) {
      dispatch(setSelectedNetworkId(teritoriNetwork.id));
    }
  }, [dispatch, currentRouteName, selectedNetworkId]);
  useFocusEffect(effect);
};

import { useFocusEffect, useRoute } from "@react-navigation/native";
import { useCallback } from "react";

import { osmosisNetwork } from "../networks/osmosis";
import { osmosisTestnetNetwork } from "../networks/osmosis-testnet";
import { teritoriNetwork } from "../networks/teritori";
import { setSelectedNetworkId } from "../store/slices/settings";
import { useAppDispatch } from "../store/store";
import { RouteName } from "../utils/navigation";
import { useSelectedNetworkId } from "./useSelectedNetwork";

export const useForceUnselectNetworks = () => {
  const dispatch = useAppDispatch();
  const { name: currentRouteName } = useRoute();
  const selectedNetworkId = useSelectedNetworkId();
  const effect = useCallback(() => {
    if (
      ((currentRouteName as RouteName) !== "Swap" &&
        selectedNetworkId === osmosisNetwork.id) ||
      selectedNetworkId === osmosisTestnetNetwork.id
    ) {
      dispatch(setSelectedNetworkId(teritoriNetwork.id));
    }
  }, [dispatch, currentRouteName, selectedNetworkId]);
  useFocusEffect(effect);
};

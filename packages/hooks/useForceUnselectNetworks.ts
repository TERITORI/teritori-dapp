import { useFocusEffect, useRoute } from "@react-navigation/native";
import { useCallback } from "react";

import { useSelectedNetworkId } from "./useSelectedNetwork";
import { teritoriNetwork } from "../networks/teritori";
import { teritoriTestnetNetwork } from "../networks/teritori-testnet";
import { setSelectedNetworkId } from "../store/slices/settings";
import { useAppDispatch } from "../store/store";
import { RouteName } from "../utils/navigation";

export const useForceUnselectNetworks = () => {
  const dispatch = useAppDispatch();
  const { name: currentRouteName } = useRoute();
  const selectedNetworkId = useSelectedNetworkId();
  const effect = useCallback(() => {
    if (
      (currentRouteName as RouteName) !== "Swap" &&
      selectedNetworkId !== teritoriTestnetNetwork.id &&
      selectedNetworkId !== teritoriNetwork.id
    ) {
      dispatch(setSelectedNetworkId(teritoriNetwork.id));
    }
  }, [dispatch, currentRouteName, selectedNetworkId]);
  useFocusEffect(effect);
};

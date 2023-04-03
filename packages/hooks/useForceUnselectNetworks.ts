import { useFocusEffect, useRoute } from "@react-navigation/native";
import { useCallback } from "react";

import { teritoriNetwork } from "../networks/teritori";
import { setSelectedNetworkId } from "../store/slices/settings";
import { useAppDispatch } from "../store/store";
import { RouteName } from "../utils/navigation";

// Automatically unselect the current network to another, depending on the RouteName (Depending on the current feature)
export const useForceUnselectNetworks = () => {
  const dispatch = useAppDispatch();
  const { name: currentRouteName } = useRoute();
  const effect = useCallback(() => {
    if ((currentRouteName as RouteName) !== "Swap") {
      dispatch(setSelectedNetworkId(teritoriNetwork.id));
    }
  }, [dispatch, currentRouteName]);
  useFocusEffect(effect);
};

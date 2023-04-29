import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

import { useSelectedNetworkId } from "./useSelectedNetwork";
import { setSelectedNetworkId } from "../store/slices/settings";
import { useAppDispatch } from "../store/store";

export const useForceNetworkSelection = (networkIds: string[] | undefined) => {
  const selectedNetworkId = useSelectedNetworkId();
  const dispatch = useAppDispatch();
  const effect = useCallback(() => {
    if (networkIds && !networkIds.includes(selectedNetworkId)) {
      dispatch(setSelectedNetworkId(networkIds[0]));
    }
  }, [dispatch, networkIds, selectedNetworkId]);
  useFocusEffect(effect);
};

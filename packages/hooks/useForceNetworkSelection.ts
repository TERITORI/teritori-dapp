import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

import { setSelectedNetworkId } from "../store/slices/settings";
import { useAppDispatch } from "../store/store";

export const useForceNetworkSelection = (networkId: string | undefined) => {
  const dispatch = useAppDispatch();
  const effect = useCallback(() => {
    if (networkId) {
      dispatch(setSelectedNetworkId(networkId));
    }
  }, [dispatch, networkId]);
  useFocusEffect(effect);
};

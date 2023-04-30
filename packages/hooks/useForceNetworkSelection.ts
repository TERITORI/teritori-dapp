import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

import { useSelectedNetworkId } from "./useSelectedNetwork";
import { getNetwork } from "../networks";
import { setSelectedNetworkId } from "../store/slices/settings";
import { useAppDispatch } from "../store/store";

export const useForceNetworkSelection = (networkIds: string[] | undefined) => {
  const selectedNetworkId = useSelectedNetworkId();
  const dispatch = useAppDispatch();
  const effect = useCallback(() => {
    if (networkIds?.length && !networkIds.includes(selectedNetworkId)) {
      // use testnet if previous is testnet
      const target = networkIds.find(
        (id) =>
          getNetwork(id)?.testnet === getNetwork(selectedNetworkId)?.testnet
      );
      dispatch(setSelectedNetworkId(target || networkIds[0]));
    }
  }, [dispatch, networkIds, selectedNetworkId]);
  useFocusEffect(effect);
};

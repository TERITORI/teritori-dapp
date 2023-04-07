import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

import { useSelectedNetworkKind } from "./useSelectedNetwork";
import { NetworkKind, selectableNetworks } from "../networks";
import { setSelectedNetworkId } from "../store/slices/settings";
import { useAppDispatch } from "../store/store";

export const useForceNetworkKind = (networkKind: NetworkKind | undefined) => {
  const selectedNetworkKind = useSelectedNetworkKind();
  const dispatch = useAppDispatch();
  const effect = useCallback(() => {
    if (networkKind && networkKind !== selectedNetworkKind) {
      const newNetwork = selectableNetworks.find(
        (network) => network.kind === networkKind
      );
      if (newNetwork) {
        dispatch(setSelectedNetworkId(newNetwork.id));
      }
    }
  }, [dispatch, networkKind, selectedNetworkKind]);
  useFocusEffect(effect);
};

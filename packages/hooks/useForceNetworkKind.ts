import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

import { useEnabledNetworks } from "./useEnabledNetworks";
import { useSelectedNetworkKind } from "./useSelectedNetwork";
import { NetworkKind } from "../networks";
import { setSelectedNetworkId } from "../store/slices/settings";
import { useAppDispatch } from "../store/store";

export const useForceNetworkKind = (networkKind: NetworkKind | undefined) => {
  const selectedNetworkKind = useSelectedNetworkKind();
  const enabledNetworks = useEnabledNetworks();
  const dispatch = useAppDispatch();
  const effect = useCallback(() => {
    if (networkKind && networkKind !== selectedNetworkKind) {
      const newNetwork = enabledNetworks.find(
        (network) => network.kind === networkKind,
      );
      if (newNetwork) {
        dispatch(setSelectedNetworkId(newNetwork.id));
      }
    }
  }, [dispatch, enabledNetworks, networkKind, selectedNetworkKind]);
  useFocusEffect(effect);
};

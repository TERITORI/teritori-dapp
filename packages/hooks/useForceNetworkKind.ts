import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

import { NetworkKind, selectableNetworks } from "../networks";
import { setSelectedNetworkId } from "../store/slices/settings";
import { useAppDispatch } from "../store/store";
import { useSelectedNetworkKind } from "./useSelectedNetwork";

export const useForceNetworkKind = (
  networkKind: NetworkKind | NetworkKind[] | undefined
) => {
  const selectedNetworkKind = useSelectedNetworkKind();
  const dispatch = useAppDispatch();

  const effect = useCallback(() => {
    const forcedKinds =
      networkKind && !Array.isArray(networkKind) ? [networkKind] : networkKind;

    if (
      selectedNetworkKind &&
      forcedKinds &&
      !forcedKinds.includes(selectedNetworkKind)
    ) {
      const firstNetworkKind = forcedKinds[0];
      const newNetwork = selectableNetworks.find(
        (network) => network.kind === firstNetworkKind
      );
      if (newNetwork) {
        dispatch(setSelectedNetworkId(newNetwork.id));
      }
    }
  }, [dispatch, networkKind, selectedNetworkKind]);
  useFocusEffect(effect);
};

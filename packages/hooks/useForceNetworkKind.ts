import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { useSelector } from "react-redux";

import { useSelectedNetworkKind } from "./useSelectedNetwork";
import { NetworkKind, allNetworks } from "../networks";
import {
  selectNetworksSettings,
  setSelectedNetworkId,
} from "../store/slices/settings";
import { useAppDispatch } from "../store/store";

export const useForceNetworkKind = (networkKind: NetworkKind | undefined) => {
  const selectedNetworkKind = useSelectedNetworkKind();
  const networksSettings = useSelector(selectNetworksSettings);
  const dispatch = useAppDispatch();
  const effect = useCallback(() => {
    if (networkKind && networkKind !== selectedNetworkKind) {
      const newNetwork = allNetworks
        .filter((n) => networksSettings[n.id]?.enabled)
        .find((network) => network.kind === networkKind);
      if (newNetwork) {
        dispatch(setSelectedNetworkId(newNetwork.id));
      }
    }
  }, [dispatch, networkKind, networksSettings, selectedNetworkKind]);
  useFocusEffect(effect);
};

import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

import { useEnabledNetworks } from "./useEnabledNetworks";
import { useSelectedNetworkInfo } from "./useSelectedNetwork";
import { NetworkFeature } from "../networks";
import { setSelectedNetworkId } from "../store/slices/settings";
import { useAppDispatch } from "../store/store";

export const useForceNetworkFeatures = (
  networkFeatures: NetworkFeature[] | undefined,
) => {
  const selectedNetwork = useSelectedNetworkInfo();
  const enabledNetworks = useEnabledNetworks();
  const dispatch = useAppDispatch();
  const effect = useCallback(() => {
    if (!networkFeatures?.length) {
      return;
    }

    if (networkFeatures.every((f) => selectedNetwork?.features.includes(f))) {
      return;
    }
    const newNetwork = enabledNetworks.find((network) =>
      networkFeatures.every((f) => network?.features.includes(f)),
    );
    if (newNetwork) {
      dispatch(setSelectedNetworkId(newNetwork.id));
    }
  }, [dispatch, enabledNetworks, networkFeatures, selectedNetwork?.features]);
  useFocusEffect(effect);
};

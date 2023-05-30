import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

import { useSelectedNetworkId } from "./useSelectedNetwork";
import { useSwitchNetwork } from "./useSwitchNetwork";
import { getNetwork } from "../networks";

export const useForceNetworkSelection = (networkIds: string[] | undefined) => {
  const selectedNetworkId = useSelectedNetworkId();
  const switchNetwork = useSwitchNetwork();

  const effect = useCallback(() => {
    if (!networkIds?.length || networkIds.includes(selectedNetworkId)) {
      return;
    }

    const shouldFindTestnet = !!getNetwork(selectedNetworkId)?.testnet;
    const targetNetworkId =
      (shouldFindTestnet &&
        networkIds.find((id) => getNetwork(id)?.testnet === true)) ||
      networkIds[0];

    switchNetwork(targetNetworkId);
  }, [networkIds, selectedNetworkId, switchNetwork]);

  useFocusEffect(effect);
};

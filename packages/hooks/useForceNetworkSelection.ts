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

    // FIXME: dubious condition
    // use testnet if previous is testnet
    const targetNetworkId =
      networkIds.find(
        (id) =>
          getNetwork(id)?.testnet === getNetwork(selectedNetworkId)?.testnet
      ) || networkIds[0];

    switchNetwork(targetNetworkId);
  }, [networkIds, selectedNetworkId, switchNetwork]);

  useFocusEffect(effect);
};

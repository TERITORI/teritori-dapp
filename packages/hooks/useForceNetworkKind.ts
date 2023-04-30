import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

import { useSelectedNetworkInfo } from "./useSelectedNetwork";
import { useSwitchNetwork } from "./useSwitchNetwork";
import { NetworkKind, getNetwork, selectableNetworks } from "../networks";

export const useForceNetworkKind = (networkKind: NetworkKind | undefined) => {
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const switchNetwork = useSwitchNetwork();

  const effect = useCallback(() => {
    if (!networkKind || networkKind === selectedNetworkInfo?.kind) {
      return;
    }

    // FIXME: this is bad
    // use testnet if previous is testnet
    const targetNetwork = selectedNetworkInfo
      ? selectableNetworks.find(
          (n) =>
            n.testnet === getNetwork(selectedNetworkInfo.id)?.testnet &&
            n.kind === networkKind
        )
      : selectableNetworks.find((n) => n.kind === networkKind);

    if (!targetNetwork) {
      return;
    }

    switchNetwork(targetNetwork.id);
  }, [networkKind, selectedNetworkInfo, switchNetwork]);

  useFocusEffect(effect);
};

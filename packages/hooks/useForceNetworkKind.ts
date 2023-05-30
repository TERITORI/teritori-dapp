import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

import { useSelectedNetworkInfo } from "./useSelectedNetwork";
import { useSwitchNetwork } from "./useSwitchNetwork";
import { NetworkKind, selectableNetworks } from "../networks";

export const useForceNetworkKind = (networkKind: NetworkKind | undefined) => {
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const switchNetwork = useSwitchNetwork();

  const effect = useCallback(() => {
    if (!networkKind || networkKind === selectedNetworkInfo?.kind) {
      return;
    }

    const validNetworks = selectableNetworks.filter(
      (n) => n.kind === networkKind
    );

    // use testnet if previous is testnet
    const shouldFindTestnet = !!selectedNetworkInfo?.testnet;
    const targetNetwork =
      (shouldFindTestnet && validNetworks.find((n) => n.testnet === true)) ||
      validNetworks[0];

    if (!targetNetwork) {
      return;
    }

    switchNetwork(targetNetwork.id);
  }, [networkKind, selectedNetworkInfo, switchNetwork]);

  useFocusEffect(effect);
};

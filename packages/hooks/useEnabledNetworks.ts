import { useMemo } from "react";
import { useSelector } from "react-redux";

import { getNetwork, NetworkInfo } from "../networks";
import {
  selectAreTestnetsEnabled,
  selectNetworksSettings,
} from "../store/slices/settings";

export const useEnabledNetworks = () => {
  const networksSettings = useSelector(selectNetworksSettings);
  const areTestnetsEnabled = useSelector(selectAreTestnetsEnabled);

  const enabledNetworks = useMemo(() => {
    return Object.values(networksSettings)
      .map((ns) => {
        if (!ns?.enabled) {
          return undefined;
        }
        const network = getNetwork(ns?.networkId);
        if (!!network && (areTestnetsEnabled || !network.testnet)) {
          return network;
        }
        return undefined;
      })
      .filter((n): n is NetworkInfo => !!n);
  }, [areTestnetsEnabled, networksSettings]);

  return enabledNetworks;
};

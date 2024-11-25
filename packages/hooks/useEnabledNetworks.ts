import { useMemo } from "react";
import { useSelector } from "react-redux";

import { useAreTestnetsEnabled } from "./useAreTestnetsEnabled";

import { getNetwork, NetworkInfo } from "@/networks";
import { selectNetworksSettings } from "@/store/slices/settings";

export const useEnabledNetworks = () => {
  const networksSettings = useSelector(selectNetworksSettings);
  const areTestnetsEnabled = useAreTestnetsEnabled();

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

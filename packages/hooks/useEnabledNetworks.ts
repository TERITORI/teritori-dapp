import { useMemo } from "react";
import { useSelector } from "react-redux";

import { useAreTestnetsEnabled } from "./useAreTestnetsEnabled";

import { useAppConfig } from "@/context/AppConfigProvider";
import { allNetworks, getNetwork, NetworkInfo } from "@/networks";
import { selectNetworksSettings } from "@/store/slices/settings";

export const useEnabledNetworks = () => {
  const networksSettings = useSelector(selectNetworksSettings);
  const areTestnetsEnabled = useAreTestnetsEnabled();
  const { forceNetworkList } = useAppConfig();

  const enabledNetworks = useMemo(() => {
    if (forceNetworkList) {
      return allNetworks.filter((n) => forceNetworkList?.includes(n.id));
    }
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
  }, [forceNetworkList, areTestnetsEnabled, networksSettings]);

  return enabledNetworks;
};

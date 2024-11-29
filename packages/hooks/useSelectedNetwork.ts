import { useSelector } from "react-redux";

import { useAppConfig } from "@/context/AppConfigProvider";
import { getNetwork } from "@/networks";
import { selectSelectedNetworkId } from "@/store/slices/settings";

export const useSelectedNetworkId = () => {
  const { defaultNetworkId } = useAppConfig();
  const currentNetworkId = useSelector(selectSelectedNetworkId);
  const networkId = currentNetworkId || defaultNetworkId;
  return networkId;
};

export const useSelectedNetworkInfo = () => {
  const selectedNetworkId = useSelectedNetworkId();
  return getNetwork(selectedNetworkId);
};

export const useSelectedNetworkKind = () => {
  const selectedNetworkInfo = useSelectedNetworkInfo();
  return selectedNetworkInfo?.kind;
};

import { useSelector } from "react-redux";

import { getNetwork } from "../networks";
import { selectSelectedNetworkId } from "../store/slices/settings";

export const useSelectedNetworkId = () => {
  const networkId =
    useSelector(selectSelectedNetworkId) || process.env.TERITORI_NETWORK_ID;
  return networkId || "";
};

export const useSelectedNetworkInfo = () => {
  const selectedNetworkId = useSelectedNetworkId();
  return getNetwork(selectedNetworkId);
};

export const useSelectedNetwork = () => {
  const selectedNetworkInfo = useSelectedNetworkInfo();
  return selectedNetworkInfo?.network;
};

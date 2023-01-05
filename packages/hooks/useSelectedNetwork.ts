import { useSelector } from "react-redux";

import { getNetwork } from "../networks";
import {
  selectSelectedNetworkId,
  setSelectedNetworkId,
} from "../store/slices/settings";
import { useAppDispatch } from "../store/store";

export const useSelectedNetworkId = () => {
  const dispatch = useAppDispatch();

  const currentNetworkId = useSelector(selectSelectedNetworkId);
  const networkId = currentNetworkId || process.env.TERITORI_NETWORK_ID || "";
  if (!currentNetworkId) {
    dispatch(setSelectedNetworkId(networkId));
  }

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

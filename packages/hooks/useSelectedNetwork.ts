import { useSelector } from "react-redux";

import { getNetwork } from "../networks";
import { selectSelectedNetworkId } from "../store/slices/settings";

export const useSelectedNetworkId = () => {
  return useSelector(selectSelectedNetworkId);
};

export const useSelectedNetworkInfo = () => {
  const selectedNetworkId = useSelectedNetworkId();
  return getNetwork(selectedNetworkId);
};

export const useSelectedNetworkKind = () => {
  const selectedNetworkInfo = useSelectedNetworkInfo();
  return selectedNetworkInfo?.kind;
};

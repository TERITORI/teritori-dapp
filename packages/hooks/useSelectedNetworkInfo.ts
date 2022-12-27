import { useSelector } from "react-redux";

import { getNetwork } from "../networks";
import { selectSelectedNetworkId } from "../store/slices/settings";

export const useSelectedNetworkInfo = () => {
  const selectedNetworkId = useSelector(selectSelectedNetworkId);
  return getNetwork(selectedNetworkId);
};

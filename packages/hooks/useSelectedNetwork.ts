import { useEffect } from "react";
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
  const networkId = currentNetworkId || "teritori";
  useEffect(() => {
    if (!currentNetworkId) {
      dispatch(setSelectedNetworkId(networkId));
    }
  }, [currentNetworkId, dispatch, networkId]);
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

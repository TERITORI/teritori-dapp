import { useEffect } from "react";
import { useSelector } from "react-redux";

import {getNetwork, mustGetCosmosNetwork, NativeCurrencyInfo, NetworkKind} from "../networks";
import {
  selectSelectedNetworkId,
  setSelectedNetworkId,
} from "../store/slices/settings";
import { useAppDispatch } from "../store/store";
import {useMultisigContext} from "../context/MultisigReducer";

export const useSelectedNetworkId = () => {
  const dispatch = useAppDispatch();
  const { state, dispatch: multisigDispatch } = useMultisigContext();
  const currentNetworkId = useSelector(selectSelectedNetworkId);
  const networkId = currentNetworkId || "teritori";
  useEffect(() => {
    if (!currentNetworkId) {
      dispatch(setSelectedNetworkId(networkId));
      const networkInfo = mustGetCosmosNetwork(networkId);
      const network = getNetwork(networkId);
      if (network && network.kind === NetworkKind.Cosmos){
        multisigDispatch({
          type: "changeChain",
          value: {
            ...state.chain,
            nodeAddress: networkInfo.rpcEndpoint,
            denom: networkInfo.currencies[0].denom,
            displayDenom: (networkInfo.currencies[0] as NativeCurrencyInfo).displayName,
            displayDenomExponent: (networkInfo.currencies[0] as NativeCurrencyInfo).decimals,
            gasPrice: process.env.PUBLIC_GAS_PRICE,
            chainId: networkInfo.chainId,
            chainDisplayName: (networkInfo.currencies[0] as NativeCurrencyInfo).displayName,
            registryName: networkInfo.displayName,
            addressPrefix: networkInfo.idPrefix
          }
        });
      }
    }
  }, [currentNetworkId, dispatch, multisigDispatch, networkId]);
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

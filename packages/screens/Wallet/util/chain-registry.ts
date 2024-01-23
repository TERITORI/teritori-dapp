import { AssetList } from "@chain-registry/types/types/assets";
import { assets } from "chain-registry";

import { useBalances } from "../../../hooks/useBalances";

export const findByBaseDenom: (token: string) => AssetList | undefined = (
  token,
) => {
  return assets.find(({ assets }) => {
    const found = assets.find(({ base }) => {
      return base === token;
    });
    if (found) return true;
  });
};

export const useGetAssets = (networkId: string, address: string) => {
  const balances = useBalances(networkId, address);

  return balances.map((balance) => {
    const assetList = findByBaseDenom(balance.denom);
    return {
      ...balance,
      ...assetList?.assets[0],
      networkId,
    };
  });
};

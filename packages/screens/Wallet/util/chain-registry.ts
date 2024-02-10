import { AssetList } from "@chain-registry/types";
import {
  CoinDenom,
  Exponent,
  getExponentByDenom as _getExponentByDenom,
} from "@chain-registry/utils";
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

export const useGetAssets = (
  networkId: string | undefined,
  address: string | undefined,
) => {
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

export const getExponentByDenom = (denom: CoinDenom): Exponent => {
  return _getExponentByDenom(assets, denom, "teritori");
};

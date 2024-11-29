import { AssetList } from "@chain-registry/types";
import {
  CoinDenom,
  Exponent,
  getExponentByDenom as _getExponentByDenom,
} from "@chain-registry/utils";
import { assets } from "chain-registry";

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

export const getExponentByDenom = (denom: CoinDenom): Exponent => {
  return _getExponentByDenom(assets, denom, "teritori");
};

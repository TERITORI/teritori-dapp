import { AssetList } from "@chain-registry/types/types/assets";
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

import { useBalances } from "../useBalances";

import { findByBaseDenom } from "@/utils/wallet/chain-registry";

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

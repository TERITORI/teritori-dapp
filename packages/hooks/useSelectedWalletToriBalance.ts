import { Decimal } from "@cosmjs/math";
import { useQuery } from "@tanstack/react-query";

import { Network } from "../utils/network";
import { toriCurrency, getUtoriBalance } from "../utils/teritori";
import useSelectedWallet from "./useSelectedWallet";

export const useSelectedWalletToriBalance = () => {
  const wallet = useSelectedWallet();
  const { data, refetch } = useQuery(
    [`toriBalance/${wallet?.publicKey}`],
    async () => {
      if (wallet?.network !== Network.Teritori || !wallet?.publicKey) {
        return Decimal.fromAtomics("0", toriCurrency.coinDecimals);
      }
      return getUtoriBalance(wallet.publicKey);
    },
    { initialData: Decimal.fromAtomics("0", toriCurrency.coinDecimals) }
  );
  return { toriBalance: data, refreshToriBalance: refetch };
};

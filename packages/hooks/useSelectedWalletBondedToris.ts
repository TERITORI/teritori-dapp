import { useQuery } from "@tanstack/react-query";
import { Decimal } from "cosmwasm";

import { Network } from "../utils/network";
import { toriCurrency, teritoriRestProvider } from "../utils/teritori";
import useSelectedWallet from "./useSelectedWallet";

export const useSelectedWalletBondedToris = (validatorAddress?: string) => {
  const wallet = useSelectedWallet();
  const { data, refetch } = useQuery(
    [`bondedToris/${wallet?.publicKey}/${validatorAddress}`],
    async () => {
      if (
        wallet?.network !== Network.Teritori ||
        !wallet.publicKey ||
        !validatorAddress
      ) {
        return Decimal.fromAtomics("0", toriCurrency.coinDecimals);
      }
      try {
        const delegations: any[] = [];
        let nextKey = "";
        while (true) {
          const httpResponse = await fetch(
            `${teritoriRestProvider}/cosmos/staking/v1beta1/delegations/${
              wallet.publicKey
            }?pagination.key=${encodeURIComponent(nextKey)}`
          );
          const response = await httpResponse.json();
          delegations.push(...response.delegation_responses);
          if (!response.pagination.next_key) {
            break;
          }
          nextKey = response.pagination.next_key;
        }
        const validatorDeleg = delegations.find(
          (deleg) => deleg.delegation.validator_address === validatorAddress
        );
        if (validatorDeleg) {
          return Decimal.fromAtomics(
            validatorDeleg.balance.amount,
            toriCurrency.coinDecimals
          );
        }
      } catch (err) {
        console.error(err);
      }
      return Decimal.fromAtomics("0", toriCurrency.coinDecimals);
    },
    { initialData: Decimal.fromAtomics("0", toriCurrency.coinDecimals) }
  );
  return { bondedTokens: data, refreshBondedTokens: refetch };
};

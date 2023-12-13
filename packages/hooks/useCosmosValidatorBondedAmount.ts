import { Decimal } from "@cosmjs/math";
import { useMemo } from "react";

import { useCosmosDelegations } from "./useCosmosDelegations";
import { getCurrency, getNativeCurrency, parseUserId } from "../networks";

export const useCosmosValidatorBondedAmount = (
  userId: string | undefined,
  validatorAddress: string | undefined,
) => {
  const { data: delegations, refetch } = useCosmosDelegations(userId);
  const amount = useMemo(() => {
    try {
      const validatorDeleg = delegations?.find(
        (deleg) => deleg.delegation.validator_address === validatorAddress,
      );
      if (!validatorDeleg) {
        return null;
      }
      const [network] = parseUserId(userId);
      if (!network) {
        return null;
      }
      const nativeCurrency = getNativeCurrency(
        network.id,
        validatorDeleg.balance.denom,
      );
      if (!nativeCurrency) {
        return null;
      }
      const currency = getCurrency(network.id, validatorDeleg.balance.denom);
      if (!currency) {
        return null;
      }
      return {
        amount: Decimal.fromAtomics(
          validatorDeleg.balance.amount,
          nativeCurrency.decimals,
        ),
        currency,
        nativeCurrency,
      };
    } catch (err) {
      console.warn("failed to get validator bonded amount:", err);
      return null;
    }
  }, [delegations, userId, validatorAddress]);

  return { bondedTokens: amount, refreshBondedTokens: refetch };
};

import { Decimal } from "@cosmjs/math";
import { useMemo } from "react";

import { useCosmosDelegations } from "./useCosmosDelegations";
import { getStakingCurrency, parseUserId } from "../networks";

const initialData = Decimal.fromAtomics("0", 0);

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
        return initialData;
      }
      const [network] = parseUserId(userId);
      if (!network) {
        return initialData;
      }
      const nativeCurrency = getStakingCurrency(network.id);
      if (!nativeCurrency) {
        return initialData;
      }
      return Decimal.fromAtomics(
        validatorDeleg.balance.amount,
        nativeCurrency.decimals,
      );
    } catch (err) {
      console.warn("failed to get validator bonded amount:", err);
      return initialData;
    }
  }, [delegations, userId, validatorAddress]);

  return { bondedTokens: amount, refreshBondedTokens: refetch };
};

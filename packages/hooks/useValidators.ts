import { Decimal } from "@cosmjs/math";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { partition } from "lodash";
import { z } from "zod";

import { getCosmosNetwork, getStakingCurrency } from "../networks";
import { ValidatorInfo } from "../screens/Stake/types";

interface StakingParams {
  unbonding_time: string;
  max_validators: number;
  max_entries: number;
  historical_entries: number;
  bond_denom: string;
}

const initialData = {
  allValidators: [],
  activeValidators: [],
  inactiveValidators: [],
};

const zodCosmosPoolData = z.object({
  bonded_tokens: z.string(),
  not_bonded_tokens: z.string(),
});

export const useValidators = (networkId: string | undefined) => {
  const { data, isFetching } = useQuery(
    ["validators", networkId],
    async () => {
      const network = getCosmosNetwork(networkId);
      if (!network) {
        return initialData;
      }
      const stakingCurrency = getStakingCurrency(networkId);
      if (!stakingCurrency) {
        throw new Error("unknown staking currency");
      }
      const poolDataRes = await axios.get(
        `${network.restEndpoint}/cosmos/staking/v1beta1/pool`,
      );
      const poolData = zodCosmosPoolData.parse(poolDataRes.data.pool);
      const bondedAprox = Decimal.fromAtomics(
        poolData.bonded_tokens,
        stakingCurrency.decimals,
      ).toFloatApproximation();
      const httpResponse = await fetch(
        `${network.restEndpoint}/cosmos/staking/v1beta1/params`,
      );
      const response = await httpResponse.json();
      const params: StakingParams = response.params;
      let key: string | null = "";
      const validators: ValidatorInfo[] = [];
      while (key !== null) {
        const response = await fetch(
          network.restEndpoint +
            "/cosmos/staking/v1beta1/validators?pagination.limit=1000&pagination.key=" +
            encodeURIComponent(key),
        );
        const payload = await response.json();

        validators.push(
          ...payload.validators.map((v: any, i: number) => {
            const vpDecimal = Decimal.fromAtomics(
              v.tokens,
              stakingCurrency.decimals,
            );
            const vpApprox = vpDecimal.toFloatApproximation();
            const info: ValidatorInfo = {
              rank: `${i + 1}`,
              moniker: v.description.moniker,
              imageURL: v.imageURL,
              status: v.status,
              address: v.operator_address,
              votingPower: vpApprox.toFixed().toString(),
              votingPowerPercent: (vpApprox / bondedAprox) * 100,
              commission: prettyPercent(v.commission.commission_rates.rate),
              description: v.description.details,
              website: v.description.website,
              identity: v.description.identity,
              jailed: !!v.jailed,
              consensusPubKey: v.consensus_pubkey,
            };
            return info;
          }),
        );
        key = payload.pagination.next_key as string | null;
      }

      const tendermintActiveValidators = await getTendermintActiveValidators(
        network.restEndpoint,
        params.max_validators,
      );

      // TODO: optimize with map lookup instead of find
      const [activeValidators, inactiveValidators] = partition(
        validators,
        (v) =>
          tendermintActiveValidators.find(
            (tv: any) =>
              tv.pub_key.key === v.consensusPubKey.key &&
              tv.pub_key.type === v.consensusPubKey.type,
          ),
      );

      activeValidators.sort(sortByVotingPower);
      formatValidators(activeValidators);

      inactiveValidators.sort(sortByVotingPower);
      formatValidators(inactiveValidators);

      return {
        allValidators: [...activeValidators, ...inactiveValidators],
        activeValidators,
        inactiveValidators,
      };
    },
    {
      staleTime: Infinity,
    },
  );

  return { isFetching, data: data || initialData };
};

const prettyPercent = (val: number) => {
  return (val * 100).toFixed(2) + "%"; // FIXME: cut useless zeros
};

const getTendermintActiveValidators = async (
  restProvider: string,
  limit: number,
): Promise<any[]> => {
  const activeValidators = await (
    await fetch(
      `${restProvider}/cosmos/base/tendermint/v1beta1/validatorsets/latest?pagination.limit=${limit}&pagination.offset=0`,
    )
  ).json();
  return activeValidators.validators;
};

const sortByVotingPower = (a: ValidatorInfo, b: ValidatorInfo) =>
  parseFloat(b.votingPower) - parseFloat(a.votingPower);

const formatValidators = (vals: ValidatorInfo[]) => {
  let i = 0;
  for (const v of vals) {
    v.rank = (i + 1).toString();
    i++;
  }
};

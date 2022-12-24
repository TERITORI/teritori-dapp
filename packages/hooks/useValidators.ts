import { useQuery } from "@tanstack/react-query";
import { Decimal } from "cosmwasm";
import { partition } from "lodash";

import { useFeedbacks } from "../context/FeedbacksProvider";
import { ValidatorInfo } from "../screens/Stake/types";
import { teritoriRestProvider, toriCurrency } from "../utils/teritori";
import {useSelector} from "react-redux";
import {selectSelectedNetworkId} from "../store/slices/settings";
import {getNetwork, NetworkInfo} from "../networks";

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

export const useValidators = () => {
  const selectedNetworkId = useSelector(selectSelectedNetworkId);
  const selectedNetwork = getNetwork(selectedNetworkId);
  const { setToastError } = useFeedbacks();

  const restProvider = selectedNetwork?.restEndpoint || teritoriRestProvider || ""

  const { data, isFetching } = useQuery(
    [`teritoriValidators`, selectedNetworkId],
    async () => {
      try {
        const httpResponse = await fetch(
          `${restProvider}/cosmos/staking/v1beta1/params`
        );
        const response = await httpResponse.json();
        const params: StakingParams = response.params;
        let key: string | null = "";
        const validators: ValidatorInfo[] = [];
        while (key !== null) {
          const response = await fetch(
            restProvider +
              "/cosmos/staking/v1beta1/validators?pagination.limit=1000&pagination.key=" +
              encodeURIComponent(key)
          );
          const payload = await response.json();

          validators.push(
            ...payload.validators.map((v: any, i: number) => {
              const info: ValidatorInfo = {
                rank: `${i + 1}`,
                moniker: v.description.moniker,
                imageURL: v.imageURL,
                status: v.status,
                address: v.operator_address,
                votingPower: Decimal.fromAtomics(
                  v.tokens,
                  toriCurrency.coinDecimals
                )
                  .toFloatApproximation()
                  .toFixed()
                  .toString(),
                commission: prettyPercent(v.commission.commission_rates.rate),
                description: v.description.details,
                website: v.description.website,
                identity: v.description.identity,
                jailed: !!v.jailed,
                consensusPubKey: v.consensus_pubkey,
              };
              return info;
            })
          );
          key = payload.pagination.next_key as string | null;
        }

        const tendermintActiveValidators = await getTendermintActiveValidators(
          params.max_validators,
          restProvider
        );

        // TODO: optimize with map lookup instead of find
        const [activeValidators, inactiveValidators] = partition(
          validators,
          (v) =>
            tendermintActiveValidators.find(
              (tv: any) =>
                tv.pub_key.key === v.consensusPubKey.key &&
                tv.pub_key.type === v.consensusPubKey.type
            )
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
      } catch (err) {
        console.error(err);
        if (err instanceof Error) {
          setToastError({
            title: "Failed to fetch validators list",
            message: err.message,
          });
        }
      }
      return initialData;
    },
    {
      initialData,
    }
  );

  return { isFetching, data };
};

const prettyPercent = (val: number) => {
  return (val * 100).toFixed(2) + "%"; // FIXME: cut useless zeros
};

const getTendermintActiveValidators = async (limit: number, restProvider: string): Promise<any[]> => {
  const activeValidators = await (
    await fetch(
      `${restProvider}/cosmos/base/tendermint/v1beta1/validatorsets/latest?pagination.limit=${limit}&pagination.offset=0`
    )
  ).json();
  return activeValidators.validators;
};

const sortByVotingPower = (a: ValidatorInfo, b: ValidatorInfo) =>
  parseFloat(b.votingPower) - parseFloat(a.votingPower);

const formatValidators = (vals: ValidatorInfo[]) => {
  let i = 0;
  for (const v of vals) {
    v.votingPower += " TORI";
    v.rank = (i + 1).toString();
    i++;
  }
};

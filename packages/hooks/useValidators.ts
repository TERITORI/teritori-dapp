import { Decimal } from "@cosmjs/math";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  AllEndpointsQuery,
  endpoints as endpointsQuery,
} from "cosmos-endpoints-scorer";
import { request } from "graphql-request";
import { partition } from "lodash";
import { useMemo } from "react";
import { z } from "zod";

import { getCosmosNetwork, getStakingCurrency } from "@/networks";
import { prettyPercent } from "@/utils/numbers";
import { ValidatorInfo } from "@/utils/types/staking";

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
  const { data: ces } = useCosmosNetworkEndpointsScores(networkId);
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

  const queryData = data || initialData;

  const finalData = useMemo(() => {
    if (ces === undefined) {
      return queryData;
    }
    const mapVals = (v: ValidatorInfo) => {
      const tld = getTLD(v.website);
      if (!tld) {
        return {
          ...v,
          serviceScore: 0,
        };
      }
      const endpoints = ces.byTLD[tld];
      let serviceScore = 0;
      if (typeof endpoints?.rpc?.meta_score === "number") {
        serviceScore += endpoints.rpc.meta_score;
      }
      if (typeof endpoints?.rest?.meta_score === "number") {
        serviceScore += endpoints.rest.meta_score;
      }
      serviceScore /= 2;

      return {
        ...v,
        serviceScore,
      };
    };
    const allValidators = queryData.allValidators.map(mapVals);
    const activeValidators = queryData.activeValidators.map(mapVals);
    const inactiveValidators = queryData.inactiveValidators.map(mapVals);
    return {
      allValidators,
      activeValidators,
      inactiveValidators,
    };
  }, [ces, queryData]);

  return { isFetching, data: finalData };
};

type MaybeArrayValue<T> = T extends (infer U)[] ? U : T;

type EndpointRes = MaybeArrayValue<AllEndpointsQuery["endpoints"]>;

const initialValue = { scores: [], byTLD: {} };

const useCosmosNetworkEndpointsScores = (networkId: string | undefined) => {
  return useQuery<{
    scores: EndpointRes[];
    byTLD: Record<string, { rest: EndpointRes; rpc: EndpointRes } | undefined>;
  }>(
    ["cosmos-network-endpoints-scores", networkId],
    async () => {
      const network = getCosmosNetwork(networkId);
      if (!network?.registryName) {
        return initialValue;
      }

      const res = await request(
        "https://ces.testnet.teritori.com/graphql/query",
        endpointsQuery,
        {
          networkName: network.registryName,
        },
      );

      if (!res.endpoints) {
        return initialValue;
      }

      const tldScores: Record<string, { rpc: EndpointRes; rest: EndpointRes }> =
        {};
      for (const endpoint of res.endpoints) {
        const url = new URL(endpoint.url);
        const tld = getTLD(url.href);
        if (!tld) {
          continue;
        }
        if (!tldScores[tld]) {
          tldScores[tld] = { rpc: null, rest: null };
        }
        switch (endpoint.kind) {
          case "rpc":
            if (!tldScores[tld].rpc) {
              tldScores[tld].rpc = endpoint;
            }
            break;
          case "rest":
            if (!tldScores[tld].rest) {
              tldScores[tld].rest = endpoint;
            }
            break;
        }
      }

      return { scores: res.endpoints, byTLD: tldScores };
    },
    { staleTime: 60000 },
  );
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

const getTLD = (url: string) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.split(".").slice(-2).join(".");
  } catch {
    return undefined;
  }
};

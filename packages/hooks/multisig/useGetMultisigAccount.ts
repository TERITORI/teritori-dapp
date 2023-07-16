import {
  MultisigThresholdPubkey,
  Coin,
  isMultisigThresholdPubkey,
} from "@cosmjs/amino";
import { StargateClient, Account } from "@cosmjs/stargate";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  GetMultisigQuery,
  GetMultisigQueryVariables,
  useGetMultisigQuery,
} from "../../api/multisig";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import {
  NetworkKind,
  getNonSigningStargateClient,
  getStakingCurrency,
  mustGetCosmosNetwork,
  parseUserId,
} from "../../networks";

export const getMultisigAccount = async (
  queryClient: QueryClient,
  address: string,
  networkId: string
) => {
  const network = mustGetCosmosNetwork(networkId);
  const client = await StargateClient.connect(network.rpcEndpoint);
  const accountOnChain = await client.getAccount(address);
  const vars: GetMultisigQueryVariables = { address, chainId: network.chainId };
  const res = await queryClient.fetchQuery(
    useGetMultisigQuery.getKey(vars),
    useGetMultisigQuery.fetcher(
      {
        endpoint: "https://graphql.eu.fauna.com/graphql",
        fetchParams: {
          headers: {
            Authorization: `Bearer ${process.env.FAUNADB_SECRET}`,
          },
        },
      },
      vars
    )
  );
  const data = res.multisig;
  return {
    accountData: accountOnChain,
    dbData: data,
  };
};

export const useGetMultisigAccount = (userId: string) => {
  const { setToastError } = useFeedbacks();
  const queryClient = useQueryClient();
  //  request
  const request = useQuery<{
    accountData: [MultisigThresholdPubkey, Account | null];
    holdings: Coin;
    dbData: GetMultisigQuery["multisig"];
  } | null>(
    ["multisig-account", userId],
    async () => {
      if (!userId) {
        return null;
      }
      const [network, userAddress] = parseUserId(userId);
      if (network?.kind !== NetworkKind.Cosmos) {
        return null;
      }
      const client = await getNonSigningStargateClient(network.id);
      const accountOnChain = await client.getAccount(userAddress);
      const tempHoldings = await client.getBalance(
        userAddress,
        getStakingCurrency(network.id)?.denom || "TODO"
      );
      if (
        accountOnChain?.pubkey &&
        !isMultisigThresholdPubkey(accountOnChain.pubkey)
      ) {
        setToastError({
          title: "Something went wrong!",
          message: "Pubkey on chain is not of type MultisigThreshold",
        });
        return null;
      }

      const vars: GetMultisigQueryVariables = {
        address: userAddress,
        chainId: network.chainId,
      };
      const res = await queryClient.fetchQuery(
        useGetMultisigQuery.getKey(vars),
        useGetMultisigQuery.fetcher(
          {
            endpoint: "https://graphql.eu.fauna.com/graphql",
            fetchParams: {
              headers: {
                Authorization: `Bearer ${process.env.FAUNADB_SECRET}`,
              },
            },
          },
          vars
        )
      );

      console.log("res", res);

      const pubkeyJSON = res.multisig?.pubkeyJSON;
      if (!pubkeyJSON) {
        setToastError({
          title: "Something went wrong!",
          message:
            "Multisig has no pubkey on node, and was not created using this tool.",
        });
        return null;
      }
      const pubkey = JSON.parse(pubkeyJSON);
      const data = res.multisig;

      return {
        accountData: [pubkey, accountOnChain],
        holdings: tempHoldings,
        dbData: data,
      };
    },
    {}
  );

  return request;
};

import { EncodeObject } from "@cosmjs/proto-signing";
import { isDeliverTxFailure, StdFee } from "@cosmjs/stargate";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { useDAOMakeProposal } from "./dao/useDAOMakeProposal";
import { useMultisigAuthToken } from "./multisig/useMultisigAuthToken";
import { useMultisigClient } from "./multisig/useMultisigClient";
import { multisigTransactionsQueryKey } from "./multisig/useMultisigTransactions";
import { multisigTransactionsCountsQueryKey } from "./multisig/useMultisigTransactionsCounts";
import useSelectedWallet from "./useSelectedWallet";
import { MultisigService, Token } from "../api/multisig/v1/multisig";
import { CosmosMsgForEmpty } from "../contracts-clients/dao-core/DaoCore.types";
import {
  UserKind,
  parseUserId,
  getCosmosNetwork,
  getStakingCurrency,
  getKeplrSigningStargateClient,
  cosmosTypesRegistry,
} from "../networks";
import { AppNavigationProp, useAppNavigation } from "../utils/navigation";

export const useRunOrProposeTransaction = (
  userId: string | undefined,
  userKind: UserKind,
) => {
  const wallet = useSelectedWallet();
  const multisigAuthToken = useMultisigAuthToken(wallet?.userId);
  const multisigClient = useMultisigClient(wallet?.networkId);
  const makeDAOProposal = useDAOMakeProposal(
    userId,
    userKind === UserKind.Organization,
  );
  const queryClient = useQueryClient();
  const navigation = useAppNavigation();
  return useCallback(
    async ({
      msgs,
      memo,
      title,
      navigateToProposals,
    }: {
      msgs: readonly EncodeObject[];
      memo?: string;
      title?: string;
      navigateToProposals?: boolean;
    }) => {
      await runOrProposeTransaction({
        userKind,
        userId,
        senderAddress: wallet?.address,
        msgs,
        memo,
        multisigClient,
        multisigAuthToken,
        title,
        makeDAOProposal,
        queryClient,
        navigateToProposals,
        navigation,
      });
    },
    [
      makeDAOProposal,
      multisigAuthToken,
      multisigClient,
      navigation,
      queryClient,
      userId,
      userKind,
      wallet?.address,
    ],
  );
};

const runOrProposeTransaction = async ({
  userKind,
  userId,
  senderAddress,
  msgs,
  memo,
  multisigClient,
  multisigAuthToken,
  title,
  makeDAOProposal,
  queryClient,
  navigateToProposals,
  navigation,
}: {
  userKind: UserKind;
  userId: string | undefined;
  senderAddress?: string;
  msgs: readonly EncodeObject[];
  memo?: string;
  multisigClient: MultisigService;
  multisigAuthToken: Token | undefined;
  title?: string;
  makeDAOProposal: ReturnType<typeof useDAOMakeProposal>;
  queryClient: QueryClient;
  navigateToProposals?: boolean;
  navigation: AppNavigationProp;
}) => {
  const [network, userAddress] = parseUserId(userId);
  if (!network) {
    throw new Error("User's network not found");
  }
  const cosmosNetwork = getCosmosNetwork(network.id);
  if (!cosmosNetwork) {
    throw new Error("User's network is not a Cosmos network");
  }
  const stakingCurrency = getStakingCurrency(network.id);
  if (!stakingCurrency) {
    throw new Error("Staking currency not found");
  }
  switch (userKind) {
    case UserKind.Single: {
      const client = await getKeplrSigningStargateClient(network.id);
      const txResponse = await client.signAndBroadcast(
        userAddress,
        msgs,
        "auto",
        memo,
      );
      if (isDeliverTxFailure(txResponse)) {
        throw new Error(txResponse.rawLog);
      }
      break;
    }
    case UserKind.Multisig: {
      if (!multisigAuthToken) {
        throw new Error("Multisig auth token not found");
      }
      if (!senderAddress) {
        throw new Error("Sender address not found");
      }
      const client = await getKeplrSigningStargateClient(network.id);
      const gasEstimate = 1000000; // TODO: simulate if possible
      const fee: StdFee = {
        gas: gasEstimate.toFixed(0),
        amount: [
          {
            amount: (gasEstimate * cosmosNetwork.gasPriceStep.average).toFixed(
              0,
            ),
            denom: stakingCurrency.denom,
          },
        ],
      };
      const account = await client.getAccount(userAddress);
      if (!account) {
        throw new Error("Multisig account not found on chain");
      }

      const encodedMsgs = msgs.map((m) => cosmosTypesRegistry.encodeAsAny(m));

      await multisigClient.CreateTransaction({
        authToken: multisigAuthToken,
        multisigAddress: userAddress,
        chainId: cosmosNetwork.chainId,
        feeJson: JSON.stringify(fee),
        msgs: encodedMsgs,
        sequence: account.sequence,
        accountNumber: account.accountNumber,
      });
      await queryClient.invalidateQueries([
        ...multisigTransactionsQueryKey(cosmosNetwork.id, userId),
      ]);
      await queryClient.invalidateQueries([
        ...multisigTransactionsQueryKey(cosmosNetwork.id, undefined),
      ]);
      await queryClient.invalidateQueries([
        ...multisigTransactionsCountsQueryKey(cosmosNetwork.id),
      ]);
      if (navigateToProposals && userId) {
        navigation.navigate("MultisigWalletDashboard", { id: userId });
      }
      break;
    }
    case UserKind.Organization: {
      if (!senderAddress) {
        throw new Error("Sender address not found");
      }
      const daoMsgs: CosmosMsgForEmpty[] = msgs.map((msg) => ({
        stargate: {
          type_url: msg.typeUrl,
          value: Buffer.from(cosmosTypesRegistry.encode(msg)).toString(
            "base64",
          ),
        },
      }));
      await makeDAOProposal(senderAddress, {
        title: title || "Proposal",
        description: "",
        msgs: daoMsgs,
      });
    }
  }
};

import { Account, calculateFee } from "@cosmjs/stargate";
import { assert } from "@cosmjs/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { multisigTransactionsQueryKey } from "./useMultisigTransactions";
import {
  CreateTransactionRequest,
  MultisigServiceClientImpl,
  GrpcWebImpl as MultisigGrpcWebImpl,
} from "../../api/multisig/v1/multisig";
import {
  NetworkKind,
  cosmosNetworkGasPrice,
  getStakingCurrency,
  parseUserId,
} from "../../networks";
import { selectMultisigToken } from "../../store/slices/settings";
import { RootState } from "../../store/store";

export const useMultisigProposeSend = (userAddress: string | undefined) => {
  const authToken = useSelector((state: RootState) =>
    selectMultisigToken(state, userAddress)
  );
  const queryClient = useQueryClient();

  // req
  const mutation = useMutation(
    async ({
      formData: { multisigId, recipientAddress, amount, memo },
      accountOnChain,
    }: {
      formData: {
        recipientAddress: string;
        amount: string;
        memo?: string;
        multisigId: string;
      };
      accountOnChain: Account | null;
    }) => {
      if (!authToken) {
        throw new Error("Auth token not found");
      }

      const [network, multisigAddress] = parseUserId(multisigId);
      if (network?.kind !== NetworkKind.Cosmos) {
        throw new Error("Network not supported");
      }

      const currency = getStakingCurrency(network?.id);
      if (!currency) {
        throw new Error("Staking currency not found");
      }

      const gasPrice = cosmosNetworkGasPrice(network, "average");
      if (!gasPrice) {
        throw new Error("Failed to get gas price");
      }

      const msgSend = {
        fromAddress: multisigAddress,
        toAddress: recipientAddress,
        amount: [
          {
            amount,
            denom: currency.denom,
          },
        ],
      };

      const msg = {
        typeUrl: "/cosmos.bank.v1beta1.MsgSend",
        value: msgSend,
      };

      const fee = calculateFee(200000, gasPrice); // TODO: use real gas estimate

      assert(accountOnChain, "accountOnChain missing");

      const req: CreateTransactionRequest = {
        multisigAddress,
        accountNumber: accountOnChain.accountNumber,
        sequence: accountOnChain.sequence,
        msgsJson: JSON.stringify([msg]),
        feeJson: JSON.stringify(fee),
        chainId: network.chainId || "",
        authToken,
      };

      const rpc = new MultisigGrpcWebImpl("http://localhost:9091", {
        debug: false,
      });
      const multisigClient = new MultisigServiceClientImpl(rpc);

      await multisigClient.CreateTransaction(req);

      queryClient.invalidateQueries(
        multisigTransactionsQueryKey(network?.chainId, multisigAddress)
      );
      queryClient.invalidateQueries(
        multisigTransactionsQueryKey(network?.chainId, undefined)
      );
    }
  );
  return mutation;
};

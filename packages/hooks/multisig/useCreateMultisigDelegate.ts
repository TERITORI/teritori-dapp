import { Decimal } from "@cosmjs/math";
import { Account, calculateFee } from "@cosmjs/stargate";
import { assert } from "@cosmjs/utils";
import { useMutation } from "@tanstack/react-query";
import moment from "moment";
import { useSelector } from "react-redux";

import {
  CreateTransactionRequest,
  MultisigServiceClientImpl,
  GrpcWebImpl as MultisigGrpcWebImpl,
} from "../../api/multisig/v1/multisig";
import { useMultisigContext } from "../../context/MultisigReducer";
import {
  MultisigTransactionDelegateFormType,
  MultisigTransactionType,
} from "../../screens/Multisig/types";
import { selectMultisigToken } from "../../store/slices/settings";
import { createTransaction } from "../../utils/faunaDB/multisig/multisigGraphql";
import { DbCreateTransaction } from "../../utils/faunaDB/multisig/types";
import useSelectedWallet from "../useSelectedWallet";

export const useCreateMultisigDelegate = (
  multisigAddress: string | undefined
) => {
  const { state } = useMultisigContext();
  const authToken = useSelector(selectMultisigToken);

  // req
  const mutation = useMutation(
    async ({
      formData: {
        multisigAddress,
        recipientAddress,
        amount,
        gasLimit,
        gasPrice,
        memo,
        multisigId,
        type,
      },
      accountOnChain,
    }: {
      formData: MultisigTransactionDelegateFormType & {
        multisigId: string;
        type: MultisigTransactionType.STAKE | MultisigTransactionType.TRANSFER;
      };
      accountOnChain: Account | null;
    }) => {
      const amountInAtomics = Decimal.fromUserInput(
        amount,
        Number(state.chain.displayDenomExponent)
      ).atomics;
      const msgDelegate = {
        delegatorAddress: multisigAddress,
        validatorAddress: recipientAddress,
        amount: {
          amount: amountInAtomics,
          denom: state.chain.denom,
        },
      };
      const msg = {
        typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
        value: msgDelegate,
      };

      const fee = calculateFee(Number(gasLimit), gasPrice);

      assert(accountOnChain, "accountOnChain missing");

      const req: CreateTransactionRequest = {
        multisigAddress,
        accountNumber: accountOnChain.accountNumber,
        sequence: accountOnChain.sequence,
        msgsJson: JSON.stringify([msg]),
        feeJson: JSON.stringify(fee),
        chainId: state.chain?.chainId || "",
        authToken,
      };

      const rpc = new MultisigGrpcWebImpl("http://localhost:9091", {
        debug: false,
      });
      const client = new MultisigServiceClientImpl(rpc);

      await client.CreateTransaction(req);
    }
  );
  return mutation;
};

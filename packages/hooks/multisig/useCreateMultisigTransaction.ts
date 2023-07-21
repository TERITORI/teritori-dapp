import { Decimal } from "@cosmjs/math";
import { Account, calculateFee } from "@cosmjs/stargate";
import { assert } from "@cosmjs/utils";
import { useMutation } from "@tanstack/react-query";
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

export const useCreateMultisigTransaction = () => {
  const authToken = useSelector(selectMultisigToken);
  const { state } = useMultisigContext();

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
      },
      accountOnChain,
    }: {
      formData: MultisigTransactionDelegateFormType & {
        multisigId: string;
        type: MultisigTransactionType.STAKE | MultisigTransactionType.TRANSFER;
      };
      accountOnChain: Account | null;
    }) => {
      console.log("mftating");

      const amountInAtomics = Decimal.fromUserInput(
        amount,
        Number(state.chain.displayDenomExponent)
      ).atomics;

      const msgSend = {
        fromAddress: multisigAddress,
        toAddress: recipientAddress,
        amount: [
          {
            amount: amountInAtomics,
            denom: state.chain.denom,
          },
        ],
      };

      const msg = {
        typeUrl: "/cosmos.bank.v1beta1.MsgSend",
        value: msgSend,
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

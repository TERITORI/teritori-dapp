import { Account } from "@cosmjs/stargate";
import { assert } from "@cosmjs/utils";
import { useMutation } from "@tanstack/react-query";
import { calculateFee, Decimal } from "cosmwasm";
import moment from "moment";

import { useMultisigContext } from "../../context/MultisigReducer";
import {
  MultisigTransactionDelegateFormType,
  MultisigTransactionType,
} from "../../screens/Multisig/types";
import { createTransaction } from "../../utils/founaDB/multisig/multisigGraphql";
import { DbTransaction } from "../../utils/founaDB/multisig/types";
import useSelectedWallet from "./../useSelectedWallet";

export const useCreateMultisigTransaction = () => {
  // variables
  const { state } = useMultisigContext();

  const selectedWallet = useSelectedWallet();

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
      try {
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

        const tx: DbTransaction = {
          accountNumber: accountOnChain.accountNumber,
          sequence: accountOnChain.sequence,
          chainId: state.chain?.chainId || "",
          msgs: [msg],
          fee,
          memo,
        };

        const stringifyData = JSON.stringify(tx);
        const saveRes = await createTransaction(
          stringifyData,
          multisigId,
          type,
          moment().toISOString(),
          selectedWallet?.address || "",
          recipientAddress
        );

        const transactionID = saveRes.data.data.createTransaction._id;

        return transactionID;
      } catch (err: any) {
        console.log(err);
      }
    }
  );
  return mutation;
};

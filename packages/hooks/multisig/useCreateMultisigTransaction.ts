import { Decimal } from "@cosmjs/math";
import { Account, calculateFee } from "@cosmjs/stargate";
import { assert } from "@cosmjs/utils";
import { useMutation } from "@tanstack/react-query";
import moment from "moment";

import useSelectedWallet from "./../useSelectedWallet";
import { useMultisigContext } from "../../context/MultisigReducer";
import {
  MultisigTransactionDelegateFormType,
  MultisigTransactionType,
} from "../../screens/Multisig/types";
import { createTransaction } from "../../utils/founaDB/multisig/multisigGraphql";
import { DbCreateTransaction } from "../../utils/founaDB/multisig/types";

export const useCreateMultisigTransaction = () => {
  const { state } = useMultisigContext();

  const { selectedWallet } = useSelectedWallet();

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

        const tx: DbCreateTransaction = {
          accountNumber: accountOnChain.accountNumber,
          sequence: accountOnChain.sequence,
          chainId: state.chain?.chainId || "",
          msgs: JSON.stringify([msg]),
          fee: JSON.stringify(fee),
          memo,
          type,
          createdAt: moment().toISOString(),
          createdBy: selectedWallet?.address || "",
          recipientAddress,
        };

        const saveRes = await createTransaction(multisigId, tx);
        console.log("saveRes", saveRes);

        const transactionID = saveRes.data.data.createTransaction._id;

        return transactionID;
      } catch (err: any) {
        console.log(err);
      }
    }
  );
  return mutation;
};

import { Coin } from "@cosmjs/amino";
import { Account, calculateFee } from "@cosmjs/stargate";
import { assert } from "@cosmjs/utils";
import { useMutation } from "@tanstack/react-query";
import moment from "moment";

import useSelectedWallet from "./../useSelectedWallet";
import { mustGetCosmosNetwork } from "../../networks";
import {
  MultisigExecuteFormType,
  MultisigTransactionType,
} from "../../screens/Multisig/types";
import { createTransaction } from "../../utils/faunaDB/multisig/multisigGraphql";
import { DbCreateTransaction } from "../../utils/faunaDB/multisig/types";
import { useSelectedNetworkId } from "../useSelectedNetwork";

export const useCreateMultisigTransactionForExecuteContract = () => {
  const { selectedWallet } = useSelectedWallet();
  const selectedNetworkId = useSelectedNetworkId();

  // req
  return useMutation(
    async ({
      formData: { multisigAddress, contractAddress, msg, multisigId, type },
      accountOnChain,
    }: {
      formData: MultisigExecuteFormType & {
        multisigId: string;
        type: MultisigTransactionType;
        funds: Coin[];
      };
      accountOnChain: Account | null;
    }) => {
      if (!selectedNetworkId) {
        return;
      }
      const network = mustGetCosmosNetwork(selectedNetworkId);

      try {
        const msgSend = {
          sender: multisigAddress,
          contract: contractAddress,
          msg: JSON.stringify(msg),
          funds: [],
        };
        const cosmwasm_msg = {
          typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
          value: msgSend,
        };
        const gasLimit = "1000000";
        const gasPrice = "0.03utori";
        const fee = calculateFee(Number(gasLimit), gasPrice);

        assert(accountOnChain, "accountOnChain missing");

        const tx: DbCreateTransaction = {
          accountNumber: accountOnChain.accountNumber,
          sequence: accountOnChain.sequence,
          chainId: network.chainId,
          msgs: JSON.stringify([cosmwasm_msg]),
          fee: JSON.stringify(fee),
          memo: "",
          type,
          createdAt: moment().toISOString(),
          createdBy: selectedWallet?.address || "",
          recipientAddress: contractAddress,
        };
        const saveRes = await createTransaction(multisigId, tx);

        return saveRes.data.data.createTransaction._id;
      } catch (err: any) {
        console.log(err);
      }
    }
  );
};

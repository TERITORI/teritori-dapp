import { createMultisigThresholdPubkey, pubkeyToAddress } from "@cosmjs/amino";
import { useMutation } from "@tanstack/react-query";

import { createOrFindMultisig } from "../../utils/faunaDB/multisig/multisigGraphql";
import { DbAccount } from "../../utils/faunaDB/multisig/types";

type CreateMultisigArguement = {
  userAddresses: string[];
  compressedPubkeys: string[];
  threshold: number;
  addressPrefix: string;
  chainId: string;
};

export const useCreateMultisig = () => {
  const mutation = useMutation(
    async ({
      compressedPubkeys,
      threshold,
      addressPrefix,
      chainId,
      userAddresses,
    }: CreateMultisigArguement) => {
      const pubkeys = compressedPubkeys.map((compressedPubkey) => {
        return {
          type: "tendermint/PubKeySecp256k1",
          value: compressedPubkey,
        };
      });
      const multisigPubkey = createMultisigThresholdPubkey(pubkeys, threshold);

      const multisigAddress = pubkeyToAddress(multisigPubkey, addressPrefix);

      // save multisig to fauna
      const multisig: DbAccount = {
        name: "yolo",
        address: multisigAddress,
        pubkeyJSON: JSON.stringify(multisigPubkey),
        chainId,
        userAddresses,
      };

      const saveRes = await createOrFindMultisig(multisig);

      console.log("saveRes", saveRes);

      if (saveRes.data.errors?.length > 0) {
        throw new Error(saveRes.data.errors[0].message);
      }

      return saveRes.data.data.createOrFindMultisig.address;
    }
  );
  return mutation;
};

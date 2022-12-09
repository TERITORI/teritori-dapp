import { createMultisigThresholdPubkey, pubkeyToAddress } from "@cosmjs/amino";
import { useMutation } from "@tanstack/react-query";

import { createOrFindMultisig } from "../utils/founaDB/multisig/multisigGraphql";
import { DbAccount } from "../utils/founaDB/multisig/types";

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
      try {
        const pubkeys = compressedPubkeys.map((compressedPubkey) => {
          return {
            type: "tendermint/PubKeySecp256k1",
            value: compressedPubkey,
          };
        });
        const multisigPubkey = createMultisigThresholdPubkey(
          pubkeys,
          threshold
        );
        const multisigAddress = pubkeyToAddress(multisigPubkey, addressPrefix);

        // save multisig to fauna
        const multisig: DbAccount = {
          address: multisigAddress,
          pubkeyJSON: JSON.stringify(multisigPubkey),
          chainId,
          userAddresses,
        };

        const saveRes = await createOrFindMultisig(multisig);
        console.log("saveRes", saveRes);

        return saveRes.data.data.createOrFindMultisig.address;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.log(err);
      }
    }
  );
  return mutation;
};

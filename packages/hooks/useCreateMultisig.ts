import { createMultisigThresholdPubkey, pubkeyToAddress } from "@cosmjs/amino";
import { useMutation } from "@tanstack/react-query";

import { createMultisig } from "../utils/founaDB/multisig/multisigGraphql";

type CreateMultisigArguement = {
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
        const multisig = {
          address: multisigAddress,
          pubkeyJSON: JSON.stringify(multisigPubkey),
          chainId,
        };

        const saveRes = await createMultisig(multisig);

        return saveRes.data.data.createMultisig.address;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.log(err);
      }
    }
  );
  return mutation;
};

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
      console.log("inside");

      try {
        console.log("inside2");
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
        console.log("inside3");

        // save multisig to fauna
        const multisig = {
          address: multisigAddress,
          pubkeyJSON: JSON.stringify(multisigPubkey),
          chainId,
        };

        console.log("inside4");

        const saveRes = await createMultisig(multisig);
        console.log("saveRes", saveRes);

        return saveRes.data.data.createMultisig.address;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.log(err);
      }
    }
  );
  return mutation;
};

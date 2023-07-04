import { useMutation } from "@tanstack/react-query";

import { UserWalletType } from "../../screens/Multisig/types";
import { createUserWallet } from "../../utils/founaDB/multisig/multisigGraphql";
import { DbUserWallet } from "../../utils/founaDB/multisig/types";

type CreateUserWalletArguement = {
  walletName: string;
  userAddress: string;
  chainId: string;
  multisigId: string;
};

export const useCreateUserWallet = () => {
  const mutation = useMutation(
    async ({
      walletName,
      userAddress,
      chainId,
      multisigId,
    }: CreateUserWalletArguement) => {
      try {
        // save userWallet to fauna
        const userWallet: DbUserWallet = {
          walletName,
          userAddress,
          chainId,
        };

        const saveRes = await createUserWallet(userWallet, multisigId);
        return {
          walletName,
          chainId,
          userAddress,
          multisigId,
          multisigAddress: saveRes.data.data.createUserWallet.multisig.address,
          multisigUserAddresses:
            saveRes.data.data.createUserWallet.multisig.userAddresses,
        } as UserWalletType;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error(err);
        return null;
      }
    }
  );
  return mutation;
};

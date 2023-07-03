import { useQuery } from "@tanstack/react-query";

import { MultisigType } from "../../screens/Multisig/types";
import { multisigsByUserAddress } from "../../utils/founaDB/multisig/multisigGraphql";

export const useFetchMultisigList = (userAddress: string, chainId: string) => {
  const req = useQuery<Omit<MultisigType, "pubkeyJSON">[]>(
    ["fetch-multisig-list", userAddress, chainId],
    async () => {
      if (!userAddress) {
        return [];
      }
      const saveRes = await multisigsByUserAddress(userAddress, chainId);
      return saveRes.data.data.multisigByUserAddress;
    }
  );

  // returns
  return req;
};

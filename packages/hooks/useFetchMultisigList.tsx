import { useQuery } from "@tanstack/react-query";

import { multisigsByUserAddress } from "../utils/founaDB/multisig/multisigGraphql";

type MultisigType = {
  _id: string;
  address: string;
  userAddresses: string[];
  chainId: string;
  pubkeyJSON: string;
};

export const useFetchMultisigList = (userAddress: string) => {
  // variables
  const req = useQuery<Omit<MultisigType, "pubkeyJSON">[]>(
    ["fetch-multisig-list", userAddress],
    async () => {
      const saveRes = await multisigsByUserAddress(userAddress);
      console.log("saveRes", saveRes);

      return saveRes.data.data.multisigByUserAddress;
    }
  );

  // returns
  return req;
};

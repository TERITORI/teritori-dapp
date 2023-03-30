import { useQuery } from "@tanstack/react-query";

import { getTransactionCountByMultisigId } from "../../utils/founaDB/multisig/multisigGraphql";
import useSelectedWallet from "../useSelectedWallet";

export const useGetTransactionCount = (multisigId: string, types: string[]) => {
  // variables
  const { selectedWallet: wallet } = useSelectedWallet();

  // request
  const req = useQuery<number[]>(
    ["fetch-multisig-list", multisigId, types, wallet?.address],
    async () => {
      const saveRes = await getTransactionCountByMultisigId(multisigId, types);

      return (
        saveRes.data?.data?.getTransactionCountByMultisigId ||
        types.map(() => 0)
      );
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  // returns
  return req;
};

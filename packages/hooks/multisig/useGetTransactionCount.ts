import { useQuery } from "@tanstack/react-query";

import { getTransactionCountByMultisigId } from "../../utils/founaDB/multisig/multisigGraphql";

export const useGetTransactionCount = (multisigId: string, types: string[]) => {
  // variables
  const req = useQuery<number[]>(
    ["fetch-multisig-list", multisigId, types],
    async () => {
      const saveRes = await getTransactionCountByMultisigId(multisigId, types);
      console.log("saveRes", saveRes);

      return saveRes.data.data.getTransactionCountByMultisigId;
    }
  );

  // returns
  return req;
};

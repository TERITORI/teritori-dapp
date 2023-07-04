import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { NetworkKind } from "../../networks";
import { MultisigType } from "../../screens/Multisig/types";
import { multisigsByUserAddress } from "../../utils/founaDB/multisig/multisigGraphql";
import { useSelectedNetworkInfo } from "../useSelectedNetwork";

export const useFetchMultisigList = (userAddress: string) => {
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const chainId = useMemo(() => {
    if (selectedNetworkInfo?.kind !== NetworkKind.Cosmos) {
      return "";
    }
    return selectedNetworkInfo.chainId;
  }, [selectedNetworkInfo?.chainId, selectedNetworkInfo?.kind]);

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

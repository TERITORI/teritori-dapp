import { useQuery } from "@tanstack/react-query";

import { useMultisigAuthToken } from "./useMultisigAuthToken";
import { useMultisigClient } from "./useMultisigClient";
import { parseUserId, NetworkKind } from "../../networks";
import useSelectedWallet from "../useSelectedWallet";

export const multisigInfoQueryKey = (multisigId: string | undefined) => [
  "multisig-info",
  multisigId,
];

export const useMultisigInfo = (id: string | undefined) => {
  const selectedWallet = useSelectedWallet();
  const authToken = useMultisigAuthToken(selectedWallet?.userId);
  const client = useMultisigClient(selectedWallet?.networkId);
  const { data, ...other } = useQuery(
    [...multisigInfoQueryKey(id), authToken, client],
    async () => {
      if (!authToken || !client) {
        return null;
      }
      const [network, multisigAddress] = parseUserId(id);
      if (network?.kind !== NetworkKind.Cosmos) {
        return null;
      }
      try {
        const { multisig } = await client.MultisigInfo({
          authToken,
          multisigAddress,
          chainId: network.chainId,
        });
        return multisig;
      } catch (err) {
        if (err instanceof Error && err.message === "not found") {
          return null;
        }
        throw err;
      }
    },
    { staleTime: Infinity },
  );
  return { multisig: data, ...other };
};

import { useQuery } from "@tanstack/react-query";

import { useMultisigClient } from "./useMultisigClient";
import useSelectedWallet from "../useSelectedWallet";

import { parseUserId, NetworkKind } from "@/networks";

export const multisigInfoQueryKey = (multisigId: string | undefined) => [
  "multisig-info",
  multisigId,
];

export const useMultisigInfo = (id: string | undefined) => {
  const selectedWallet = useSelectedWallet();
  const client = useMultisigClient(selectedWallet?.networkId);
  const { data, ...other } = useQuery(
    [...multisigInfoQueryKey(id), client],
    async () => {
      if (!client) {
        return null;
      }
      const [network, multisigAddress] = parseUserId(id);
      if (network?.kind !== NetworkKind.Cosmos) {
        return null;
      }
      try {
        const { multisig } = await client.MultisigInfo({
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

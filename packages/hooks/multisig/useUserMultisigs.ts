import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import {
  MultisigServiceClientImpl,
  GrpcWebImpl as MultisigGrpcWebImpl,
} from "../../api/multisig/v1/multisig";
import { NetworkKind, parseUserId } from "../../networks";
import { selectMultisigToken } from "../../store/slices/settings";

const batchSize = 100;

export const useUserMultisigs = (userId: string | undefined) => {
  const authToken = useSelector(selectMultisigToken);
  const { data, ...other } = useQuery(
    ["userMultisigs", userId, authToken],
    async () => {
      const [network] = parseUserId(userId);
      if (network?.kind !== NetworkKind.Cosmos) {
        return [];
      }
      const rpc = new MultisigGrpcWebImpl("http://localhost:9091", {
        debug: false,
      });
      const client = new MultisigServiceClientImpl(rpc);
      const { multisigs } = await client.Multisigs({
        limit: batchSize,
        authToken,
        chainId: network.chainId,
      });
      return multisigs;
    }
  );
  return { multisigs: data || [], ...other };
};

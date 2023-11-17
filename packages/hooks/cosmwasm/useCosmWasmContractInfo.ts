import { useQuery } from "@tanstack/react-query";
import { bech32 } from "bech32";

import { ContractVersion } from "../../contracts-clients/dao-core/DaoCore.types";
import {
  getNetwork,
  mustGetNonSigningCosmWasmClient,
  NetworkKind,
  parseUserId,
} from "../../networks";

const useCosmWasmContractVersion = (
  networkId: string | undefined,
  address: string | undefined,
) => {
  return useQuery(
    ["cosmwasmContractVersion", networkId, address],
    async () => {
      if (!networkId || !address) {
        return null;
      }

      const network = getNetwork(networkId);
      if (network?.kind !== NetworkKind.Cosmos) {
        return null;
      }

      const client = await mustGetNonSigningCosmWasmClient(networkId);
      const { info } = await client.queryContractSmart(address, { info: {} });
      return info as ContractVersion;
    },
    { staleTime: Infinity },
  );
};

export const useIsDAO = (userId: string | undefined) => {
  const [network, address] = parseUserId(userId);
  const { data: contractVersion } = useCosmWasmContractVersion(
    network?.id,
    address,
  );
  if (network?.kind === NetworkKind.Gno) {
    try {
      bech32.decode(address);
      return { isDAO: false };
    } catch {}
    return { isDAO: true };
  }
  return {
    isDAO: [
      "crates.io:dao-core",
      "crates.io:cw-core",
      "crates.io:dao-dao-core",
    ].includes(contractVersion?.contract || ""),
  };
};

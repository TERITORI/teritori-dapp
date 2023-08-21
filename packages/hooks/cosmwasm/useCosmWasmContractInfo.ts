import { useQuery } from "@tanstack/react-query";

import { ContractVersion } from "../../contracts-clients/dao-core/DaoCore.types";
import { mustGetNonSigningCosmWasmClient } from "../../networks";

export const useCosmWasmContract = (
  networkId: string | undefined,
  address: string | null | undefined
) => {
  return useQuery(
    ["cosmwasmContract", networkId, address],
    async () => {
      if (!networkId || !address) {
        return null;
      }
      const client = await mustGetNonSigningCosmWasmClient(networkId);
      const contract = await client.getContract(address);
      return contract;
    },
    { staleTime: Infinity }
  );
};

export const useCosmWasmCodeDetails = (
  networkId: string | undefined,
  codeId: number | undefined
) => {
  return useQuery(
    ["cosmwasmCodeDetails", networkId, codeId],
    async () => {
      if (!networkId || !codeId) {
        return null;
      }
      const client = await mustGetNonSigningCosmWasmClient(networkId);
      const info = await client.getCodeDetails(codeId);
      return info;
    },
    { staleTime: Infinity }
  );
};

export const useCosmWasmContractVersion = (
  networkId: string | undefined,
  address: string | undefined
) => {
  return useQuery(
    ["cosmwasmContractVersion", networkId, address],
    async () => {
      if (!networkId || !address) {
        return null;
      }
      const client = await mustGetNonSigningCosmWasmClient(networkId);
      const { info } = await client.queryContractSmart(address, { info: {} });
      return info as ContractVersion;
    },
    { staleTime: Infinity }
  );
};

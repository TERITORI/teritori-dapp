import { useQuery } from "@tanstack/react-query";

import { TeritoriMinter__factory } from "../../evm-contracts-clients/teritori-bunker-minter/TeritoriMinter__factory";
import { NetworkKind, getNetwork } from "../../networks";
import { getEthereumProvider } from "../../utils/ethereum";

export const useEthMinterNFTAddress = (
  networkId: string | undefined,
  mintAddress: string,
  enabled?: boolean,
) => {
  if (enabled === undefined) {
    enabled = true;
  }
  return useQuery(
    ["ethMinterNftAddress", networkId, mintAddress],
    async () => {
      const network = getNetwork(networkId);
      if (network?.kind !== NetworkKind.Ethereum) {
        return undefined;
      }

      const provider = await getEthereumProvider(network);
      if (!provider) {
        return undefined;
      }

      const minterClient = TeritoriMinter__factory.connect(
        mintAddress,
        provider,
      );
      return await minterClient.callStatic.nft();
    },
    { staleTime: Infinity, enabled: enabled && !!networkId },
  );
};

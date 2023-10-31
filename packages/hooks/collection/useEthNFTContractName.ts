import { useQuery } from "@tanstack/react-query";

import { TeritoriNft__factory } from "../../evm-contracts-clients/teritori-nft/TeritoriNft__factory";
import { NetworkKind, getNetwork } from "../../networks";
import { getEthereumProvider } from "../../utils/ethereum";

export const useEthNFTContractName = (
  networkId: string | undefined,
  nftAddress: string | undefined,
) => {
  return useQuery(
    ["ethNFTContractName ", networkId, nftAddress],
    async () => {
      if (!nftAddress) {
        return undefined;
      }

      const network = getNetwork(networkId);
      if (network?.kind !== NetworkKind.Ethereum) {
        return undefined;
      }

      const provider = await getEthereumProvider(network);
      if (!provider) {
        return undefined;
      }

      const nftClient = TeritoriNft__factory.connect(nftAddress, provider);
      return await nftClient.callStatic.name();
    },
    { staleTime: Infinity, enabled: !!networkId && !!nftAddress },
  );
};

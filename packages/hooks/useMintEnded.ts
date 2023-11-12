import { useQuery } from "@tanstack/react-query";

import { TeritoriBunkerMinterQueryClient } from "../contracts-clients/teritori-bunker-minter/TeritoriBunkerMinter.client";
import { TeritoriMinter__factory } from "../evm-contracts-clients/teritori-bunker-minter/TeritoriMinter__factory";
import {
  mustGetNonSigningCosmWasmClient,
  parseNetworkObjectId,
  NetworkKind,
} from "../networks";
import { getEthereumProvider } from "../utils/ethereum";

export const useMintEnded = (collectionId: string, enabled: boolean = true) => {
  const { data } = useQuery(
    ["mintEnded", collectionId],
    async () => {
      if (!collectionId) {
        return false;
      }

      const [network, mintAddress] = parseNetworkObjectId(collectionId);

      if (network?.kind === NetworkKind.Cosmos) {
        if (mintAddress === network.nameServiceContractAddress) {
          return false;
        }

        const cosmwasm = await mustGetNonSigningCosmWasmClient(network.id);

        const minterClient = new TeritoriBunkerMinterQueryClient(
          cosmwasm,
          mintAddress,
        );
        const conf = await minterClient.config();

        const mintedAmount = await minterClient.currentSupply();

        return mintedAmount === conf.nft_max_supply;
      } else if (network?.kind === NetworkKind.Ethereum) {
        const provider = await getEthereumProvider(network);
        if (!provider) {
          console.error("no eth provider found");
          return false;
        }

        const minterClient = TeritoriMinter__factory.connect(
          mintAddress,
          provider,
        );
        const minterConfig = await minterClient.callStatic.config();
        const mintedAmount = (await minterClient.currentSupply()).toNumber();
        return mintedAmount === minterConfig.maxSupply.toNumber();
      }

      console.error(`unknown collectionId ${collectionId}`);
      return false;
    },
    { enabled, staleTime: Infinity },
  );
  return data;
};

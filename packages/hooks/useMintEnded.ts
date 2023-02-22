import { useQuery } from "@tanstack/react-query";

import { TeritoriBunkerMinterQueryClient } from "../contracts-clients/teritori-bunker-minter/TeritoriBunkerMinter.client";
import { TeritoriMinter__factory } from "../evm-contracts-clients/teritori-bunker-minter/TeritoriMinter__factory";
import { getEthereumProvider } from "../utils/ethereum";
import { getNonSigningCosmWasmClient } from "../utils/keplr";

export const useMintEnded = (id: string) => {
  const { data } = useQuery(["mintEnded", id], async () => {
    if (!id) {
      return false;
    }

    const [addressPrefix, mintAddress] = id.split("-");

    if (addressPrefix === "tori") {
      if (mintAddress === process.env.TERITORI_NAME_SERVICE_CONTRACT_ADDRESS) {
        return false;
      }

      const cosmwasm = await getNonSigningCosmWasmClient();

      const minterClient = new TeritoriBunkerMinterQueryClient(
        cosmwasm,
        mintAddress
      );
      const conf = await minterClient.config();

      const mintedAmount = await minterClient.currentSupply();

      return mintedAmount === conf.nft_max_supply;
    } else if (addressPrefix === "eth") {
      const provider = await getEthereumProvider();
      if (!provider) {
        console.error("no eth provider found");
        return false;
      }

      const minterClient = TeritoriMinter__factory.connect(
        mintAddress,
        provider
      );
      const minterConfig = await minterClient.callStatic.config();
      const mintedAmount = (await minterClient.currentSupply()).toNumber();
      return mintedAmount === minterConfig.maxSupply.toNumber();
    }

    console.error(`unknown collectionId ${id}`);
    return false;
  });
  return data;
};

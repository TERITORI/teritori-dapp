import { useQuery } from "@tanstack/react-query";

import { TeritoriBunkerMinterQueryClient } from "../contracts-clients/teritori-bunker-minter/TeritoriBunkerMinter.client";
import { getNonSigningCosmWasmClient } from "../utils/keplr";

export const useMintEnded = (id: string) => {
  const { data } = useQuery(["mintEnded", id], async () => {
    if (!id) {
      return false;
    }

    const mintAddress = id.replace("tori-", "");

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
  });
  return data;
};

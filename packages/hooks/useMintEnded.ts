import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { TeritoriBunkerMinterQueryClient } from "../contracts-clients/teritori-bunker-minter/TeritoriBunkerMinter.client";
import { getNetwork } from "../networks";
import { selectSelectedNetworkId } from "../store/slices/settings";
import { getNonSigningCosmWasmClient } from "../utils/keplr";

export const useMintEnded = (id: string) => {
  const selectedNetworkId = useSelector(selectSelectedNetworkId);
  const selectedNetwork = getNetwork(selectedNetworkId);
  const { data } = useQuery(["mintEnded", id, selectedNetworkId], async () => {
    if (!id) {
      return false;
    }

    const mintAddress = id.replace("tori-", "");

    if (mintAddress === process.env.TERITORI_NAME_SERVICE_CONTRACT_ADDRESS) {
      return false;
    }

    const cosmwasm = await getNonSigningCosmWasmClient(selectedNetwork);

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

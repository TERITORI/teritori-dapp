import { useMemo } from "react";

import {
  NFTsRequest,
  Sort,
  SortDirection,
} from "../../api/marketplace/v1/marketplace";
import { THE_RIOT_COLLECTION_ADDRESS } from "../../screens/RiotGame/settings";
import { useContractClients } from "../useContractClients";
import { useNFTs } from "../useNFTs";
import useSelectedWallet from "../useSelectedWallet";

export const useRippers = () => {
  const selectedWallet = useSelectedWallet();

  const { client: nftClient, queryClient: nftQueryClient } = useContractClients(
    "teritori-nft",
    THE_RIOT_COLLECTION_ADDRESS
  );

  const myRippersRequest: NFTsRequest = {
    collectionId: `tori-${THE_RIOT_COLLECTION_ADDRESS}`,
    ownerId: selectedWallet?.address ? `tori-${selectedWallet.address}` : "",
    limit: 1000,
    offset: 0,
    sort: Sort.SORTING_UNSPECIFIED,
    sortDirection: SortDirection.SORT_DIRECTION_UNSPECIFIED,
  };
  const { nfts: myRippers } = useNFTs(myRippersRequest);

  const myAvailableRippers = useMemo(() => {
    return myRippers.filter((r) => !r.isListed);
  }, [myRippers]);

  return {
    myRippers,
    myAvailableRippers,
    nftClient,
    nftQueryClient,
  };
};

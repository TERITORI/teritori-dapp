import { useMemo } from "react";

import {
  NFTsRequest,
  Sort,
  SortDirection,
} from "../../api/marketplace/v1/marketplace";
import {
  THE_RIOT_BREEDING_CONTRACT_ADDRESS,
  THE_RIOT_COLLECTION_ADDRESS,
} from "../../utils/game";
import { useNFTs } from "../useNFTs";
import useSelectedWallet from "../useSelectedWallet";
import { useSelectedNetworkId } from "./../useSelectedNetwork";

export const useRippers = () => {
  const selectedWallet = useSelectedWallet();
  const selectedNetworkId = useSelectedNetworkId();

  const nftReq = {
    ownerId: selectedWallet?.address ? `tori-${selectedWallet.address}` : "",
    networkId: selectedNetworkId,
    limit: 1000,
    offset: 0,
    sort: Sort.SORTING_UNSPECIFIED,
    sortDirection: SortDirection.SORT_DIRECTION_UNSPECIFIED,
  };

  // Support squad stake for rioter NFT + their child
  const myRippersRequest: NFTsRequest = {
    collectionId: `tori-${THE_RIOT_COLLECTION_ADDRESS}`,
    ...nftReq,
  };

  const myRipperChildsRequest: NFTsRequest = {
    collectionId: `tori-${THE_RIOT_BREEDING_CONTRACT_ADDRESS}`,
    ...nftReq,
  };

  const { nfts: myRippers } = useNFTs(myRippersRequest);
  const { nfts: myRipperChilds } = useNFTs(myRipperChildsRequest);

  const myAvailableRippers = useMemo(() => {
    if (!selectedWallet?.address) return [];

    return [...myRippers, ...myRipperChilds].filter(
      (r) => !r.isListed && !r.lockedOn
    );
  }, [myRippers, myRipperChilds, selectedWallet?.address]);

  return {
    myRippers,
    myAvailableRippers,
  };
};

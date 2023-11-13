import { useMemo } from "react";

import {
  NFTsRequest,
  Sort,
  SortDirection,
} from "../../api/marketplace/v1/marketplace";
import { getCollectionId, getCosmosNetwork } from "../../networks";
import { isNFTStaked } from "../../utils/game";
import { useNFTs } from "../useNFTs";
import useSelectedWallet from "../useSelectedWallet";

export const useRippers = () => {
  const selectedWallet = useSelectedWallet();
  const networkId = selectedWallet?.networkId;
  const network = getCosmosNetwork(networkId);
  const riotCollectionIdGen0 = getCollectionId(
    networkId,
    network?.riotContractAddressGen0,
  );
  const breedingCollectionId = getCollectionId(
    networkId,
    network?.riotContractAddressGen1,
  );

  const nftReq: Omit<NFTsRequest, "collectionId"> = {
    ownerId: selectedWallet?.userId || "",
    limit: 1000,
    offset: 0,
    sort: Sort.SORT_UNSPECIFIED,
    sortDirection: SortDirection.SORT_DIRECTION_UNSPECIFIED,
    attributes: [],
    isListed: false,
    priceRange: undefined,
  };

  // Support squad stake for rioter NFT + their child
  const myRippersRequest: NFTsRequest = {
    collectionId: riotCollectionIdGen0,
    ...nftReq,
  };

  const myRipperChildsRequest: NFTsRequest = {
    collectionId: breedingCollectionId,
    ...nftReq,
  };

  // FIXME: allow to pass multiple collection ids in backend api

  const { nfts: myRippers } = useNFTs(myRippersRequest);
  const { nfts: myRipperChilds } = useNFTs(myRipperChildsRequest);

  const myAvailableRippers = useMemo(() => {
    return [...myRippers, ...myRipperChilds].filter(
      (r) => !r.isListed && (!r.lockedOn || isNFTStaked(r)),
    );
  }, [myRipperChilds, myRippers]);

  return {
    myRippers,
    myAvailableRippers,
  };
};

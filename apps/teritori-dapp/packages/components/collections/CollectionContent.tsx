import React from "react";
import { useSelector } from "react-redux";

import { TabsListType } from "./types";
import {
  NFTsRequest,
  Sort,
  SortDirection,
} from "../../api/marketplace/v1/marketplace";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import {
  selectAllSelectedAttributeDataByCollectionId,
  selectBuyNow,
  selectPriceRange,
} from "../../store/slices/marketplaceFilters";
import { RootState } from "../../store/store";
import { ActivityTable } from "../activity/ActivityTable";
import { NFTs } from "../nfts/NFTs";

export const CollectionContent: React.FC<{
  id: string;
  selectedTab: TabsListType;
  sortDirection: SortDirection;
}> = React.memo(({ id, selectedTab, sortDirection }) => {
  const wallet = useSelectedWallet();

  const selectedFilters = useSelector((state: RootState) =>
    selectAllSelectedAttributeDataByCollectionId(state, id),
  );
  const isBuyNow = useSelector(selectBuyNow);
  const priceRange = useSelector(selectPriceRange);

  const nftsRequest: NFTsRequest = {
    collectionId: id,
    ownerId: (selectedTab === "owned" && wallet?.userId) || "",
    limit: 100,
    offset: 0,
    sort: Sort.SORT_PRICE,
    sortDirection,
    attributes: selectedFilters,
    isListed: isBuyNow,
    priceRange,
  };

  switch (selectedTab) {
    case "collections":
    case "owned":
      return <NFTs key={selectedTab} req={nftsRequest} />;
    case "activity":
      return <ActivityTable collectionId={id} />;
  }
  return null;
});

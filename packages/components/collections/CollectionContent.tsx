import React from "react";
import { useSelector } from "react-redux";

import { TabsListType } from "./types";
import {
  NFTsRequest,
  Sort,
  SortDirection,
} from "../../api/marketplace/v1/marketplace";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import {
  selectAllSelectedAttributeData,
  selectBuyNow,
  selectPriceRange,
} from "../../store/slices/marketplaceFilters";
import { alignDown } from "../../utils/align";
import { ActivityTable } from "../activity/ActivityTable";
import { Footer } from "../footers/Footer";
import { NFTs } from "../nfts/NFTs";

const nftWidth = 268; // FIXME: ssot

export const CollectionContent: React.FC<{
  id: string;
  selectedTab: TabsListType;
  sortDirection: SortDirection;
}> = React.memo(({ id, selectedTab, sortDirection }) => {
  const wallet = useSelectedWallet();

  const { width } = useMaxResolution();
  const numColumns = Math.floor(width / nftWidth);
  const selectedFilters = useSelector(selectAllSelectedAttributeData);
  const isBuyNow = useSelector(selectBuyNow);
  const priceRange = useSelector(selectPriceRange);

  const nftsRequest: NFTsRequest = {
    collectionId: id,
    ownerId: (selectedTab === "owned" && wallet?.userId) || "",
    limit: alignDown(20, numColumns) || numColumns,
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
      return (
        <NFTs
          key={selectedTab}
          req={nftsRequest}
          ListFooterComponent={<Footer />}
        />
      );
    case "activity":
      return <ActivityTable collectionId={id} />;
  }
  return null;
});

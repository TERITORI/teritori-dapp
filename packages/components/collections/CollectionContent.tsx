import React from "react";

import { TabsListType } from "./types";
import {
  NFTsRequest,
  Sort,
  SortDirection,
} from "../../api/marketplace/v1/marketplace";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import useSelectedWallet from "../../hooks/useSelectedWallet";
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

  const nftsRequest: NFTsRequest = {
    collectionId: id,
    ownerId: (selectedTab === "owned" && wallet?.userId) || "",
    limit: alignDown(20, numColumns) || numColumns,
    offset: 0,
    sort: Sort.SORT_PRICE,
    sortDirection,
  };

  switch (selectedTab) {
    case "collections":
    case "owned":
      return (
        <NFTs
          key={selectedTab}
          req={nftsRequest}
          numColumns={numColumns}
          ListFooterComponent={<Footer />}
        />
      );
    case "activity":
      return <ActivityTable collectionId={id} />;
  }
});

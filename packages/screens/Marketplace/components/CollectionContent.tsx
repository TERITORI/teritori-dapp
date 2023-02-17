import React from "react";

import {
  NFTsRequest,
  Sort,
  SortDirection,
} from "../../../api/marketplace/v1/marketplace";
import { ActivityTable } from "../../../components/activity/ActivityTable";
import { Footer } from "../../../components/footers/Footer";
import { NFTs } from "../../../components/nfts/NFTs";
import { useMaxResolution } from "../../../hooks/useMaxResolution";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { alignDown } from "../../../utils/align";
import { TabsListType } from "../types";

const nftWidth = 268; // FIXME: ssot

export const CollectionContent: React.FC<{
  id: string;
  selectedTab: TabsListType;
  sortDirection: SortDirection;
}> = React.memo(({ id, selectedTab, sortDirection }) => {
  const wallet = useSelectedWallet();
  const selectedNetworkId = useSelectedNetworkId();

  const { width } = useMaxResolution();
  const numColumns = Math.floor(width / nftWidth);

  const nftsRequest: NFTsRequest = {
    networkId: selectedNetworkId,
    collectionId: id,
    ownerId:
      selectedTab === "owned" && wallet?.address
        ? `tori-${wallet.address}`
        : "",
    limit: alignDown(20, numColumns) || numColumns,
    offset: 0,
    sort: Sort.SORTING_PRICE,
    sortDirection,
  };

  switch (selectedTab) {
    case "allNFTs":
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

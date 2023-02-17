import React, { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";

import {
  NFTsRequest,
  Sort,
  SortDirection,
} from "../../api/marketplace/v1/marketplace";
import { ScreenContainer } from "../../components/ScreenContainer";
import { ActivityTable } from "../../components/activity/ActivityTable";
import { CollectionContent } from "../../components/collections/CollectionContent";
import { CollectionHeader } from "../../components/collections/CollectionHeader";
import { TabsListType } from "../../components/collections/types";
import { Footer } from "../../components/footers/Footer";
import { NFTs } from "../../components/nfts/NFTs";
import { useCollectionInfo } from "../../hooks/useCollectionInfo";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { alignDown } from "../../utils/align";
import { ScreenFC } from "../../utils/navigation";

const nftWidth = 268; // FIXME: ssot

export const Content: React.FC<{
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

export const CollectionScreen: ScreenFC<"Collection"> = ({ route }) => {
  // variables
  const { id } = route.params;
  const [selectedTab, setSelectedTab] = useState<TabsListType>("allNFTs");
  const { info } = useCollectionInfo(id);
  const [sortDirection, setSortDirection] = useState(
    SortDirection.SORT_DIRECTION_ASCENDING
  );

  // returns
  return (
    <ScreenContainer fullWidth footerChildren={<></>} noMargin noScroll>
      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <CollectionHeader
          collectionId={id}
          collectionInfo={info}
          selectedTab={selectedTab}
          onSelectTab={setSelectedTab}
          onChangeSortDirection={setSortDirection}
          sortDirection={sortDirection}
        />
        <CollectionContent
          key={id}
          id={id}
          selectedTab={selectedTab}
          sortDirection={sortDirection}
        />
      </ScrollView>
    </ScreenContainer>
  );
};

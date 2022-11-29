import React, { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";

import { SortDirection } from "../../api/marketplace/v1/marketplace";
import { useCollectionInfo } from "../../hooks/useCollectionInfo";
import {
  TabsListType,
  Header as CollectionHeader,
  Content as CollectionContent,
} from "../Marketplace/CollectionScreen";
import { GameContentView } from "./component/GameContentView";

const THE_RIOT_COLLECTION_ID = `tori-${process.env.THE_RIOT_COLLECTION_ADDRESS}`;

export const RiotGameMarketplaceScreen = () => {
  const id = THE_RIOT_COLLECTION_ID;
  const [selectedTab, setSelectedTab] = useState<TabsListType>("allNFTs");
  const { info } = useCollectionInfo(id);
  const [sortDirection, setSortDirection] = useState(
    SortDirection.SORT_DIRECTION_ASCENDING
  );

  // returns
  return (
    <GameContentView>
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
    </GameContentView>
  );
};

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
import { THE_RIOT_COLLECTION_ID } from "./settings";

export const RiotGameMarketplaceScreen = () => {
  const [selectedTab, setSelectedTab] = useState<TabsListType>("allNFTs");
  const { info } = useCollectionInfo(THE_RIOT_COLLECTION_ID);
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
          collectionId={THE_RIOT_COLLECTION_ID}
          collectionInfo={info}
          selectedTab={selectedTab}
          onSelectTab={setSelectedTab}
          onChangeSortDirection={setSortDirection}
          sortDirection={sortDirection}
        />
        <CollectionContent
          id={THE_RIOT_COLLECTION_ID}
          selectedTab={selectedTab}
          sortDirection={sortDirection}
        />
      </ScrollView>
    </GameContentView>
  );
};

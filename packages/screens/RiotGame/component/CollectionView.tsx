import React, { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";

import { SortDirection } from "../../../api/marketplace/v1/marketplace";
import { useCollectionInfo } from "../../../hooks/useCollectionInfo";
import { CollectionContent } from "../../Marketplace/components/CollectionContent";
import { CollectionHeader } from "../../Marketplace/components/CollectionHeader";
import { TabsListType } from "../../Marketplace/types";

type CollectionViewProps = {
  collectionId: string;
};

export const CollectionView: React.FC<CollectionViewProps> = ({
  collectionId,
}) => {
  const { info } = useCollectionInfo(collectionId);
  const [selectedTab, setSelectedTab] = useState<TabsListType>("allNFTs");
  const [sortDirection, setSortDirection] = useState(
    SortDirection.SORT_DIRECTION_ASCENDING
  );

  return (
    <ScrollView
      style={{ width: "100%" }}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <CollectionHeader
        collectionId={collectionId}
        collectionInfo={info}
        selectedTab={selectedTab}
        onSelectTab={setSelectedTab}
        onChangeSortDirection={setSortDirection}
        sortDirection={sortDirection}
      />
      <CollectionContent
        id={collectionId}
        selectedTab={selectedTab}
        sortDirection={sortDirection}
      />
    </ScrollView>
  );
};

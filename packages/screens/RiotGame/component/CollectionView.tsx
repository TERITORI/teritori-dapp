import React, { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";

import { SortDirection } from "../../../api/marketplace/v1/marketplace";
import { CollectionContent } from "../../../components/collections/CollectionContent";
import { CollectionHeader } from "../../../components/collections/CollectionHeader";
import { TabsListType } from "../../../components/collections/types";
import { useCollectionInfo } from "../../../hooks/useCollectionInfo";

type CollectionViewProps = {
  collectionId: string;
};

export const CollectionView: React.FC<CollectionViewProps> = ({
  collectionId,
}) => {
  const { collectionInfo: info } = useCollectionInfo(collectionId);
  const [selectedTab, setSelectedTab] = useState<TabsListType>("collections");
  const [sortDirection, setSortDirection] = useState(
    SortDirection.SORT_DIRECTION_ASCENDING,
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

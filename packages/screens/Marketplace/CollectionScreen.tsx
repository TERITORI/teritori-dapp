import React, { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";

import { SortDirection } from "../../api/marketplace/v1/marketplace";
import { ScreenContainer } from "../../components/ScreenContainer";
import { CollectionContent } from "../../components/collections/CollectionContent";
import { CollectionHeader } from "../../components/collections/CollectionHeader";
import { TabsListType } from "../../components/collections/types";
import { useCollectionInfo } from "../../hooks/useCollectionInfo";
import { ScreenFC } from "../../utils/navigation";

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

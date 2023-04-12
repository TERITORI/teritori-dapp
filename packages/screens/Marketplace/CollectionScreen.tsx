import React, { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";

import { SortDirection } from "../../api/marketplace/v1/marketplace";
import { ScreenContainer } from "../../components/ScreenContainer";
import { CollectionContent } from "../../components/collections/CollectionContent";
import { CollectionHeader } from "../../components/collections/CollectionHeader";
import { TabsListType } from "../../components/collections/types";
import { useCollectionInfoHeader } from "../../hooks/useCollectionInfoHeader";
import { parseCollectionId } from "../../networks";
import { ScreenFC } from "../../utils/navigation";

export const CollectionScreen: ScreenFC<"Collection"> = ({ route }) => {
  // variables
  const { id } = route.params;
  const [selectedTab, setSelectedTab] = useState<TabsListType>("allNFTs");
  const { info: collectionInfoHeader } = useCollectionInfoHeader(id);
  const [sortDirection, setSortDirection] = useState(
    SortDirection.SORT_DIRECTION_ASCENDING
  );
  const [network] = parseCollectionId(id);

  // returns
  return (
    <ScreenContainer
      fullWidth
      footerChildren={<></>}
      noMargin
      noScroll
      forceNetworkId={network?.id}
    >
      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <CollectionHeader
          collectionId={id}
          collectionInfoHeader={collectionInfoHeader}
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

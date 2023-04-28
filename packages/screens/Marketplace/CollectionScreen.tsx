import React, { useState } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { SideCart } from "./SideCart";
import { SortDirection } from "../../api/marketplace/v1/marketplace";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { CollectionContent } from "../../components/collections/CollectionContent";
import { CollectionHeader } from "../../components/collections/CollectionHeader";
import { TabsListType } from "../../components/collections/types";
import { useCollectionInfo } from "../../hooks/useCollectionInfo";
import { parseCollectionId } from "../../networks";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { fontSemibold20 } from "../../utils/style/fonts";

export const CollectionScreen: ScreenFC<"Collection"> = ({ route }) => {
  // variables
  const { id } = route.params;
  const [selectedTab, setSelectedTab] = useState<TabsListType>("collections");
  const { collectionInfo: info } = useCollectionInfo(id);
  const [sortDirection, setSortDirection] = useState(
    SortDirection.SORT_DIRECTION_ASCENDING
  );
  const [network] = parseCollectionId(id);
  const navigation = useAppNavigation();

  // returns
  return (
    <ScreenContainer
      key={`Collection ${id}`} // this key is to reset the screen state when the id changes
      fullWidth
      footerChildren={<></>}
      headerChildren={
        <BrandText style={fontSemibold20}>
          {info.name && `${info.name} Collection Profile`}
        </BrandText>
      }
      noMargin
      responsive
      noScroll
      onBackPress={() => navigation.navigate("Marketplace")}
      forceNetworkId={network?.id}
    >
      <View
        style={{
          flexDirection: "row",
          flexWrap: "nowrap",
        }}
      >
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
        <SideCart
          style={{
            position: "absolute",
            right: 135,
            marginTop: 36,
          }}
        />
      </View>
    </ScreenContainer>
  );
};

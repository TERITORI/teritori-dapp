import React, { useState } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";

import { SideCart } from "./SideCart";
import { SortDirection } from "../../api/marketplace/v1/marketplace";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { CollectionContent } from "../../components/collections/CollectionContent";
import { CollectionHeader } from "../../components/collections/CollectionHeader";
import { TabsListType } from "../../components/collections/types";
import { useCollectionInfo } from "../../hooks/useCollectionInfo";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { parseCollectionId } from "../../networks";
import { selectSelectedNFT } from "../../store/slices/marketplaceReducer";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { neutral67 } from "../../utils/style/colors";
import { fontSemibold20 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

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
  const { width } = useMaxResolution();
  const selected = useSelector(selectSelectedNFT);

  const SideCartWidth = 245 + 10;
  // returns
  return (
    <ScreenContainer
      key={`Collection ${id}`} // this key is to reset the screen state when the id changes
      footerChildren={<></>}
      headerChildren={
        <BrandText style={fontSemibold20}>
          {info.name && `${info.name} Collection Profile`}
        </BrandText>
      }
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
          contentContainerStyle={{
            alignItems: "center",
            width: selected.length > 0 ? width - SideCartWidth : width,
          }}
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
            right: -10,
            marginTop: 36,
            flexDirection: "column",
            width: 245,
            marginBottom: layout.padding_x2_5,
            borderRadius: layout.padding_x2,
            borderColor: neutral67,
            borderWidth: 1,
            padding: layout.padding_x2,
            borderStyle: "solid",
          }}
        />
      </View>
    </ScreenContainer>
  );
};

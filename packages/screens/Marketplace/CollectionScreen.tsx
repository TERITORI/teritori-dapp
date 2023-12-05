import React, { useState } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { SideCart, useShowCart } from "./SideCart";
import { SortDirection } from "../../api/marketplace/v1/marketplace";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { CollectionContent } from "../../components/collections/CollectionContent";
import { CollectionHeader } from "../../components/collections/CollectionHeader";
import { TabsListType } from "../../components/collections/types";
import { useCollectionInfo } from "../../hooks/useCollectionInfo";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { parseCollectionId } from "../../networks";
import {
  setBuyNow,
  setShowFilters,
} from "../../store/slices/marketplaceFilters";
import { useAppDispatch } from "../../store/store";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { neutral00, neutral33 } from "../../utils/style/colors";
import { fontSemibold20 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

export const CollectionScreen: ScreenFC<"Collection"> = ({ route }) => {
  const { id } = route.params;
  const [selectedTab, setSelectedTab] = useState<TabsListType>("collections");
  const { collectionInfo: info } = useCollectionInfo(id);
  const [sortDirection, setSortDirection] = useState(
    SortDirection.SORT_DIRECTION_ASCENDING,
  );
  const [network] = parseCollectionId(id);
  const navigation = useAppNavigation();
  const { width } = useMaxResolution({
    responsive: true,
    noMargin: false,
    isLarge: true,
  });
  const cartIsShown = useShowCart();
  const dispatch = useAppDispatch();

  const handleOnSelectTab = (item: TabsListType) => {
    if (item !== "collections") {
      dispatch(setShowFilters(false));
      dispatch(setBuyNow(false));
    }
    setSelectedTab(item);
  };

  const SideCartWidth = 245 + 10;
  return (
    <ScreenContainer
      isLarge
      key={`Collection ${id}`} // this key is to reset the screen state when the id changes
      footerChildren={<></>}
      headerChildren={<BrandText style={fontSemibold20}>{info.name}</BrandText>}
      responsive
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
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            width: cartIsShown ? width - SideCartWidth : width,
          }}
        >
          <CollectionHeader
            collectionId={id}
            collectionInfo={info}
            selectedTab={selectedTab}
            onSelectTab={handleOnSelectTab}
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
            marginTop: layout.spacing_x4,
            flexDirection: "column",
            width: 245,
            marginBottom: layout.spacing_x2_5,
            backgroundColor: neutral00,
            borderRadius: layout.spacing_x2,
            borderColor: neutral33,
            borderWidth: 1,
            paddingVertical: layout.spacing_x1,
            paddingHorizontal: layout.spacing_x1_5,
            borderStyle: "solid",
          }}
        />
      </View>
    </ScreenContainer>
  );
};

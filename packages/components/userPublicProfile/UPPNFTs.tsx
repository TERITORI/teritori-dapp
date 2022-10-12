import React from "react";
import { View } from "react-native";

import { layout } from "../../utils/style/layout";
import { FilterButton } from "../sorts/FilterButton";
import { SearchInput } from "../sorts/SearchInput";
import { SortButton } from "../sorts/SortButton";
import { TabItem, Tabs, useTabs } from "../tabs/Tabs";

const tabItemsNFTs: TabItem[] = [
  { label: "Collected", isSelected: true, badgeCount: 32 },
  { label: "Created", isSelected: false },
  { label: "Favorited", isSelected: false },
];

const SelectedTabContent: React.FC<{
  selectedTabItemLabel: string;
}> = ({ selectedTabItemLabel }) => {
  switch (selectedTabItemLabel) {
    case "Collected":
      return <></>;
    case "Created":
      return <></>;
    case "Favorited":
      return <></>;
    default:
      return null;
  }
};

export const UPPNFTs: React.FC = () => {
  const { onPressTabItem, tabItems, selectedTabItem } = useTabs(tabItemsNFTs);

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: 64,
          marginTop: layout.padding_x2_5 / 2,
        }}
      >
        <Tabs
          items={tabItems}
          onPressTabItem={onPressTabItem}
          style={{ width: 436, height: 44 }}
        />
        <FilterButton style={{ marginLeft: layout.padding_x2_5 }} />
        {/*TODO: Too long (See at right on the render)*/}
        <SearchInput style={{ marginHorizontal: layout.padding_x2_5 }} />
        <SortButton />
      </View>

      <View>
        <SelectedTabContent selectedTabItemLabel={selectedTabItem.label} />
      </View>
    </>
  );
};

import React, { useState } from "react";
import { TouchableOpacity, View, StyleProp, ViewStyle } from "react-native";

import { neutral33 } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";

export type TabItem = {
  label: string;
  isSelected?: boolean;
};

export const useTabs = (items) => {
  const [tabItems, setTabItems] = useState(items);
  const [selectedTabItem, setSelectedTabItem] = useState(
    items.filter((item) => item.isSelected)[0]
  );

  const onPressTabItem = (pressedItem: TabItem) => {
    // Select the pressed TabItem and unselect all the others
    const updatedItems = [];
    tabItems.map((tabItem) => {
      tabItem.isSelected = tabItem.label === pressedItem.label;
      updatedItems.push(tabItem);
    });
    setTabItems(updatedItems);

    // Set the selected TabItem to provide it (No need to use whole tabItems to find the selected one)
    setSelectedTabItem(pressedItem);
  };
  return { onPressTabItem, tabItems, selectedTabItem };
};

export const Tabs: React.FC<{
  items: TabItem[];
  borderColorTabSelected?: string;
  onPressTabItem: (item: TabItem) => void;
  style?: StyleProp<ViewStyle>;
}> = ({ items, borderColorTabSelected, onPressTabItem, style }) => {
  return (
    <View
      style={[
        {
          height: 40,
          width: "100%",
          flexDirection: "row",
          borderBottomColor: neutral33,
          borderBottomWidth: 1,
        },
        style,
      ]}
    >
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onPressTabItem(item)}
          style={{ height: "100%" }}
        >
          <View
            style={[
              { marginHorizontal: 12, height: "100%" },
              // If the item is selected, we add a borderBottom and shift it with marginTop: 1 to keep the same tabs labels horizontal alignment
              item.isSelected && {
                borderBottomWidth: 2,
                borderBottomColor: borderColorTabSelected,
              },
              style,
            ]}
          >
            <BrandText style={fontSemibold14}>{item.label}</BrandText>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

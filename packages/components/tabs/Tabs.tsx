import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from "react-native";

import { neutral33 } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { genericStyles } from "../../utils/style/genericStyles";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { PrimaryBadge } from "../badges/PrimaryBadge";
import { TertiaryBadge } from "../badges/TertiaryBadge";
import { SpacerRow } from "../spacer";

export type TabItem = {
  label: string;
  isSelected?: boolean;
  badgeCount?: number;
};

export const useTabs = (items: TabItem[]) => {
  const [tabItems, setTabItems] = useState(items);
  const [selectedTabItem, setSelectedTabItem] = useState(
    items.filter((item: TabItem) => item.isSelected)[0]
  );

  const onPressTabItem = (pressedItem: TabItem) => {
    // Select the pressed TabItem and unselect all the others
    const updatedItems: TabItem[] = [];
    tabItems.map((tabItem: TabItem) => {
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
}> = ({ items, borderColorTabSelected = "#FFFFFF", onPressTabItem, style }) => {
  // returns
  return (
    <View
      style={[
        {
          width: "100%",
          flexDirection: "row",
          borderBottomColor: neutral33,
          borderBottomWidth: 1,
        },
      ]}
    >
      {items.map((item, index) => (
        <TouchableOpacity key={index} onPress={() => onPressTabItem(item)}>
          <View
            style={[
              genericStyles.rowWithCenterAndSB,
              {
                marginRight: index !== items.length - 1 ? layout.padding_x3 : 0,
                paddingBottom: layout.padding_x3,
              },
            ]}
          >
            <BrandText style={[fontSemibold14, { lineHeight: 14 }]}>
              {item.label}
            </BrandText>

            {item.badgeCount && <SpacerRow size={1} />}
            {item.badgeCount ? (
              item.isSelected ? (
                <PrimaryBadge
                  backgroundColor="secondary"
                  label={item.badgeCount}
                />
              ) : (
                <TertiaryBadge style={{ height: 24 }} label={item.badgeCount} />
              )
            ) : null}
          </View>
          {item.isSelected && (
            <View
              style={[
                styles.selectedBorder,
                { backgroundColor: borderColorTabSelected },
              ]}
            />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  selectedBorder: {
    height: 2,
    width: "100%",
    position: "absolute",
    bottom: -2,
  },
});

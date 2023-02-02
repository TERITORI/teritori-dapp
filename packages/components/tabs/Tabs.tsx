import { useScrollTo } from "@nandorojo/anchor";
import React from "react";
import {
  TouchableOpacity,
  View,
  StyleProp,
  StyleSheet,
  ViewStyle,
  useWindowDimensions,
} from "react-native";

import { neutral33, neutral77 } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout, smallMobileWidth } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { PrimaryBadge } from "../badges/PrimaryBadge";
import { TertiaryBadge } from "../badges/TertiaryBadge";
import { SpacerRow } from "../spacer";

interface TabDefinition {
  name: string;
  badgeCount?: number;
  disabled?: boolean;
  scrollTo?: string;
}

export const Tabs = <T extends { [key: string]: TabDefinition }>({
  items,
  borderColorTabSelected = "#FFFFFF",
  onSelect,
  style,
  selected,
  hideSelector,
}: {
  items: T;
  selected: keyof T;
  onSelect: (key: keyof T, def: TabDefinition) => void;
  borderColorTabSelected?: string;
  style?: StyleProp<ViewStyle>;
  hideSelector?: boolean;
}) => {
  const { width } = useWindowDimensions();
  const { scrollTo } = useScrollTo();
  const itemsArray = Object.entries(items);
  return (
    <View
      style={[
        {
          flexDirection: "row",
          borderBottomColor: neutral33,
          alignItems: "center",
          borderBottomWidth: 1,
        },
        style,
      ]}
    >
      {itemsArray.map(([key, item], index) => {
        const isSelected = selected === key;
        return (
          <TouchableOpacity
            key={key}
            onPress={() =>
              item.scrollTo
                ? scrollTo(item.scrollTo, { offset: -60 })
                : onSelect(key, item)
            }
            disabled={item.disabled}
            style={{
              height: "100%",
              justifyContent: "center",
              marginRight:
                index !== itemsArray.length - 1 ? layout.padding_x3 : 0,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                height: 24,
              }}
            >
              <BrandText
                style={[
                  fontSemibold14,
                  { lineHeight: 14 },
                  item.disabled && { color: neutral77 },
                ]}
              >
                {item.name}
              </BrandText>

              {item.badgeCount && <SpacerRow size={1} />}
              <View
                style={{ display: width < smallMobileWidth ? "none" : "flex" }}
              >
                {item.badgeCount ? (
                  isSelected ? (
                    <PrimaryBadge
                      size="SM"
                      backgroundColor="secondary"
                      label={item.badgeCount}
                    />
                  ) : (
                    <TertiaryBadge size="SM" label={item.badgeCount} />
                  )
                ) : null}
              </View>
            </View>
            {!hideSelector && isSelected && (
              <View
                style={[
                  styles.selectedBorder,
                  { backgroundColor: borderColorTabSelected },
                ]}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  selectedBorder: {
    height: 2,
    width: "100%",
    position: "absolute",
    bottom: -1,
  },
});

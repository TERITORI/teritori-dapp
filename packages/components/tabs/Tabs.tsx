import { useScrollTo } from "@nandorojo/anchor";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  TouchableOpacity,
  View,
  StyleProp,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

import { useIsMobileView } from "../../hooks/useIsMobileView";
import {
  gradientColorBlue,
  gradientColorDarkerBlue,
  gradientColorTurquoise,
  neutral33,
  neutral77,
  secondaryColor,
} from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { PrimaryBadge } from "../badges/PrimaryBadge";
import { TertiaryBadge } from "../badges/TertiaryBadge";
import { GradientText } from "../gradientText";
import { SpacerRow } from "../spacer";

export interface TabDefinition {
  name: string;
  badgeCount?: number;
  disabled?: boolean;
  scrollTo?: string;
}

export const Tabs = <T extends { [key: string]: TabDefinition }>({
  items,
  borderColorTabSelected = secondaryColor,
  onSelect,
  style,
  selected,
  hideSelector,
  tabStyle,
  gradientText,
  tabTextStyle,
  tabContainerStyle,
}: {
  items: T;
  selected: keyof T;
  onSelect: (key: keyof T, def: TabDefinition) => void;
  borderColorTabSelected?: string;
  style?: StyleProp<ViewStyle>;
  hideSelector?: boolean;
  tabStyle?: ViewStyle;
  gradientText?: boolean;
  tabTextStyle?: StyleProp<TextStyle>;
  tabContainerStyle?: StyleProp<ViewStyle>;
}) => {
  const { scrollTo } = useScrollTo();
  const itemsArray = Object.entries(items);
  return (
    <View
      style={[
        {
          flexDirection: useIsMobileView() ? "column" : "row",
          borderBottomColor: neutral33,
          alignItems: "center",
          borderBottomWidth: 1,
        },
        useIsMobileView() ? null : style,
        // style,
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
            style={[
              {
                height: 44,
                justifyContent: "center",
                marginRight:
                  index !== itemsArray.length - 1 ? layout.padding_x3 : 0,
              },
              tabContainerStyle,
            ]}
          >
            <View
              style={[
                {
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",

                  height: 24,
                },
                tabStyle,
              ]}
            >
              {isSelected && gradientText ? (
                <GradientText
                  gradientType="blueExtended"
                  style={[fontSemibold14, tabTextStyle]}
                >
                  {item.name}
                </GradientText>
              ) : (
                <BrandText
                  style={[
                    fontSemibold14,
                    { lineHeight: 14 },
                    item.disabled && { color: neutral77 },
                    tabTextStyle,
                  ]}
                >
                  {item.name}
                </BrandText>
              )}

              {item.badgeCount !== undefined && <SpacerRow size={1} />}
              {item.badgeCount !== undefined ? (
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
            {!hideSelector && isSelected && (
              <>
                {gradientText ? (
                  <LinearGradient
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={[
                      styles.selectedBorder,
                      { height: 2, width: "100%" },
                    ]}
                    colors={[
                      gradientColorDarkerBlue,
                      gradientColorBlue,
                      gradientColorTurquoise,
                    ]}
                  />
                ) : (
                  <View
                    style={[
                      styles.selectedBorder,
                      { backgroundColor: borderColorTabSelected },
                    ]}
                  />
                )}
              </>
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

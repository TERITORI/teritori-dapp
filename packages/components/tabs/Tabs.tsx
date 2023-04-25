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
  ScrollView,
} from "react-native";

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

interface TabDefinition {
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
  gradientText?: boolean;
  tabTextStyle?: StyleProp<TextStyle>;
  tabContainerStyle?: StyleProp<ViewStyle>;
}) => {
  const { scrollTo } = useScrollTo();
  const itemsArray = Object.entries(items);
  return (
    // styles are applied weirdly to scrollview so it's better to apply them to a constraining view
    <View style={style}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={{
          alignItems: "center",
          borderBottomColor: neutral33,
          borderBottomWidth: 1,
        }}
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
                  height: "100%",
                  justifyContent: "center",
                  marginRight:
                    index !== itemsArray.length - 1 ? layout.padding_x3 : 0,
                },
                tabContainerStyle,
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",

                  height: 24,
                }}
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

                {item.badgeCount && <SpacerRow size={1} />}
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
      </ScrollView>
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

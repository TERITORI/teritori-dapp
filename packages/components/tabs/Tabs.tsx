import { useScrollTo } from "@nandorojo/anchor";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef } from "react";
import {
  LayoutChangeEvent,
  ScrollView,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import pointsSVG from "../../../assets/icons/points.svg";
import {
  gradientColorBlue,
  gradientColorDarkerBlue,
  gradientColorTurquoise,
  neutral33,
  neutral77,
  secondaryColor,
  yellowPremium,
} from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { objectKeys } from "../../utils/typescript";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { PrimaryBadge } from "../badges/PrimaryBadge";
import { TertiaryBadge } from "../badges/TertiaryBadge";
import { GradientText } from "../gradientText";
import { SpacerRow } from "../spacer";

import { useDeveloperMode } from "@/hooks/useDeveloperMode";
import { TabDefinition } from "@/utils/types/tabs";

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
  noUnderline,
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
  noUnderline?: boolean;
}) => {
  const { scrollTo } = useScrollTo();
  const scrollViewRef = useRef<ScrollView>(null);
  const itemsKeys = objectKeys(items);

  const onSelectedItemLayout = (e: LayoutChangeEvent) => {
    scrollViewRef.current?.scrollTo({
      x: e.nativeEvent.layout.x,
      animated: false,
    });
  };
  const [developerMode] = useDeveloperMode();
  return (
    // styles are applied weirdly to ScrollView, so it's better to apply them to a constraining view
    <>
      <View
        style={[
          !noUnderline && {
            borderBottomColor: neutral33,
            borderBottomWidth: 1,
          },
          style,
        ]}
      >
        <ScrollView
          ref={scrollViewRef}
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={{
            alignItems: "center",
          }}
        >
          {itemsKeys.map((key, index) => {
            const item = items[key];
            const isSelected = selected === key;

            if (key === "premium-content" && !developerMode) {
              return null;
            } else {
              return (
                <TouchableOpacity
                  onLayout={isSelected ? onSelectedItemLayout : undefined}
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
                        index !== itemsKeys.length - 1 ? layout.spacing_x3 : 0,
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
                    {key === "premium-content" && (
                      <View
                        style={{
                          position: "relative",
                          marginRight: layout.spacing_x1,
                        }}
                      >
                        <SVG source={pointsSVG} width={16} height={16} />
                      </View>
                    )}
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
                          key === "premium-content" && { color: yellowPremium },
                          item.disabled && { color: neutral77 },
                          tabTextStyle,
                        ]}
                      >
                        {item.name}
                      </BrandText>
                    )}

                    {!!item.badgeCount && <SpacerRow size={1} />}
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

                    {item.iconSVG && (
                      <View style={{ position: "relative" }}>
                        <SVG
                          source={item.iconSVG}
                          color={item.iconColor || secondaryColor}
                          width={16}
                          height={16}
                          style={{ position: "absolute", top: -16, left: -2 }}
                        />
                      </View>
                    )}
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
                            {
                              backgroundColor:
                                key === "premium-content"
                                  ? yellowPremium
                                  : borderColorTabSelected,
                            },
                          ]}
                        />
                      )}
                    </>
                  )}
                </TouchableOpacity>
              );
            }
          })}
        </ScrollView>
      </View>
    </>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  selectedBorder: {
    height: 2,
    width: "100%",
    position: "absolute",
    bottom: -1,
  },
});

import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useScrollTo } from "@nandorojo/anchor";
import { LinearGradient } from "expo-linear-gradient";
import { cloneDeep } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { useFetchFeed } from "../../hooks/feed/useFetchFeed";
import { useSelectedNetworkInfo } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { NetworkKind } from "../../networks";
import { extractGnoNumber } from "../../utils/gno";
import { feedsTabItems } from "../../utils/social-feed";
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
import { SVG } from "../SVG";
import { PrimaryBadge } from "../badges/PrimaryBadge";
import { TertiaryBadge } from "../badges/TertiaryBadge";
import { GradientText } from "../gradientText";
import { PostCategory } from "../socialFeed/NewsFeed/NewsFeed.type";
import { SpacerColumn, SpacerRow } from "../spacer";

export interface TabDefinition {
  name: string;
  badgeCount?: number;
  disabled?: boolean;
  scrollTo?: string;
  iconSVG?: any;
  iconColor?: string;
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
  noUnderline,
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
  noUnderline?: boolean;
}) => {
  const { scrollTo } = useScrollTo();

  const selectedNetworkInfo = useSelectedNetworkInfo();
  const selectedNetworkKind = selectedNetworkInfo?.kind;
  const selectedWallet = useSelectedWallet();
  const [isDAOMember, setIsDAOMember] = useState(false);

  const req = {
    filter: {
      categories: [PostCategory.Flagged],
      user: "",
      mentions: [],
      hashtags: [],
    },
    limit: 1,
    offset: 0,
  };
  const { data } = useFetchFeed(req);

  const hasFlaggedPosts = useMemo(() => {
    return (data?.pages?.[0]?.totalCount || 0) > 0;
  }, [data]);

  const adjustedFeedsTabItems = useMemo(() => {
    const res = cloneDeep(feedsTabItems);
    const iconSVG = res.moderationDAO.iconSVG;
    res.moderationDAO.iconSVG = null;

    if (selectedNetworkKind === NetworkKind.Gno && hasFlaggedPosts) {
      res.moderationDAO.iconSVG = iconSVG;
    }

    return res;
  }, [selectedNetworkKind, hasFlaggedPosts]);

  const itemsArray = useMemo(() => {
    return Object.entries(adjustedFeedsTabItems).filter((item) => {
      if (selectedNetworkKind === NetworkKind.Gno && isDAOMember) return true;
      return item[0] !== "moderationDAO";
    });
  }, [selectedNetworkKind, adjustedFeedsTabItems, isDAOMember]);

  useEffect(() => {
    if (selectedNetworkInfo?.kind !== NetworkKind.Gno) {
      return;
    }

    if (!selectedWallet?.address) {
      return;
    }

    if (!selectedNetworkInfo.groupsPkgPath) {
      console.error("groupsPkgPath is not provided");
      return;
    }

    const client = new GnoJSONRPCProvider(selectedNetworkInfo?.endpoint);
    const socialFeedsDAOGGroupId = "1"; // 0000000001

    client
      .evaluateExpression(
        selectedNetworkInfo.groupsPkgPath,
        `GetMemberWeightByAddress(${socialFeedsDAOGGroupId}, "${selectedWallet.address}")`
      )
      .then((result) => {
        const value = extractGnoNumber(result);
        setIsDAOMember(value > 0);
      })
      .catch((e) => console.error(e));
  }, [selectedNetworkInfo, selectedWallet?.address]);

  return (
    // styles are applied weirdly to scrollview so it's better to apply them to a constraining view
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
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={{
            alignItems: "center",
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

      <SpacerColumn size={1.5} />

      {selected === "moderationDAO" && (
        <BrandText style={{ alignSelf: "flex-start" }}>
          {hasFlaggedPosts
            ? "Please review all applications carefully and give your verdict."
            : "There are no items to moderate yet."}
        </BrandText>
      )}
    </>
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

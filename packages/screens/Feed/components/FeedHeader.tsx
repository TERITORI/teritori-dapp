import { cloneDeep } from "lodash";
import React, { useMemo } from "react";
import { StyleSheet } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { PostCategory } from "../../../components/socialFeed/NewsFeed/NewsFeed.type";
import { SpacerColumn } from "../../../components/spacer";
import { Tabs } from "../../../components/tabs/Tabs";
import { useFetchFeed } from "../../../hooks/feed/useFetchFeed";
import { useMaxResolution } from "../../../hooks/useMaxResolution";
import { useSelectedNetworkInfo } from "../../../hooks/useSelectedNetwork";
import { NetworkKind } from "../../../networks";
import { feedsTabItems } from "../../../utils/social-feed";
import { primaryColor } from "../../../utils/style/colors";
import { fontSemibold16 } from "../../../utils/style/fonts";

export type FeedHeaderProps = {
  selectedTab: keyof typeof feedsTabItems;
  onTabChange: (value: keyof typeof feedsTabItems) => void;
};

export const FeedHeader: React.FC<FeedHeaderProps> = ({
  selectedTab,
  onTabChange,
}) => {
  const { width } = useMaxResolution();
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const selectedNetworkKind = selectedNetworkInfo?.kind;

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

  return (
    <>
      <Tabs
        items={adjustedFeedsTabItems}
        selected={selectedTab}
        onSelect={onTabChange}
        style={[styles.header, { width }]}
        borderColorTabSelected={primaryColor}
        gradientText
        tabTextStyle={fontSemibold16}
        tabContainerStyle={{ height: 64 }}
      />

      <SpacerColumn size={1.5} />

      {selectedTab === "moderationDAO" && (
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
  header: {
    alignSelf: "center",
    height: 64,
    zIndex: 9,
    elevation: 9,
  },
});

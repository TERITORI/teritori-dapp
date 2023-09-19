import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { cloneDeep } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { PostCategory } from "../../../components/socialFeed/NewsFeed/NewsFeed.type";
import { SpacerColumn } from "../../../components/spacer";
import { Tabs } from "../../../components/tabs/Tabs";
import { useFetchFeed } from "../../../hooks/feed/useFetchFeed";
import { useMaxResolution } from "../../../hooks/useMaxResolution";
import { useSelectedNetworkInfo } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { NetworkKind } from "../../../networks";
import { extractGnoNumber } from "../../../utils/gno";
import { feedsTabItems } from "../../../utils/social-feed";
import { primaryColor } from "../../../utils/style/colors";
import { fontSemibold16 } from "../../../utils/style/fonts";

type FeedHeaderProps = {
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

  const adjustedTabItems = useMemo(() => {
    const res = cloneDeep(feedsTabItems);

    if (
      selectedNetworkKind === NetworkKind.Gno &&
      res.moderationDAO &&
      !hasFlaggedPosts
    ) {
      res.moderationDAO.iconSVG = null;
    }

    if (selectedNetworkKind !== NetworkKind.Gno || !isDAOMember) {
      delete res["moderationDAO"];
    }

    return res;
  }, [hasFlaggedPosts, isDAOMember, selectedNetworkKind]);

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
    <>
      <Tabs
        items={adjustedTabItems}
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

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  header: {
    alignSelf: "center",
    height: 64,
    zIndex: 9,
    elevation: 9,
  },
});

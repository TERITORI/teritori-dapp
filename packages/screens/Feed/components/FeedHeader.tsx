import React, { useMemo } from "react";
import { StyleSheet } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { SpacerColumn } from "../../../components/spacer";
import { Tabs } from "../../../components/tabs/Tabs";
import { useMaxResolution } from "../../../hooks/useMaxResolution";
import { useSelectedNetworkKind } from "../../../hooks/useSelectedNetwork";
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

  const selectedNetworkKind = useSelectedNetworkKind();

  // NODE: Keep moderationDAO tab only on Gno for now
  const adjustedFeedsTabItems = useMemo(() => {
    if (selectedNetworkKind === NetworkKind.Gno) {
      return feedsTabItems;
    }

    const feedsTabItemsWithoutModerationDAO = { ...feedsTabItems };
    // @ts-ignore
    // Ignore to avoid: The operand of a 'delete' operator must be optional
    delete feedsTabItemsWithoutModerationDAO.moderationDAO;
    return feedsTabItemsWithoutModerationDAO;
  }, [selectedNetworkKind]);

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
          Please review all applications carefully and give your verdict.
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

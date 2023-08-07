import React from "react";
import { StyleSheet } from "react-native";

import { SpacerColumn } from "../../../components/spacer";
import { Tabs } from "../../../components/tabs/Tabs";
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
  return (
    <>
      <Tabs
        items={feedsTabItems}
        selected={selectedTab}
        onSelect={onTabChange}
        style={[styles.header, { width: "100%" }]}
        borderColorTabSelected={primaryColor}
        gradientText
        tabTextStyle={fontSemibold16}
        tabContainerStyle={{ height: 64 }}
      />
      <SpacerColumn size={1.5} />
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

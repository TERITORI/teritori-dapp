import React from "react";
import { StyleSheet } from "react-native";

import { SpacerColumn } from "../../../components/spacer";
import { Tabs } from "../../../components/tabs/Tabs";
import { screenTabItems } from "../../../utils/feed";
import { primaryColor } from "../../../utils/style/colors";
import { fontSemibold16 } from "../../../utils/style/fonts";

export type FeedHeaderProps = {
  selectedTab: keyof typeof screenTabItems;
  onTabChange: (value: keyof typeof screenTabItems) => void;
};

export const FeedHeader: React.FC<FeedHeaderProps> = ({
  selectedTab,
  onTabChange,
}) => {
  return (
    <>
      <Tabs
        items={screenTabItems}
        selected={selectedTab}
        onSelect={onTabChange}
        style={styles.header}
        borderColorTabSelected={primaryColor}
        gradientText
        textStyle={fontSemibold16}
      />
      <SpacerColumn size={1.5} />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 64,
    zIndex: 9,
    elevation: 9,
  },
});

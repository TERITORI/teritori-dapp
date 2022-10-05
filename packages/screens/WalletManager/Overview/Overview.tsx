import React from "react";
import { useWindowDimensions, View } from "react-native";

import {
  ASSET_RATIO_MARGIN_RIGHT,
  ASSET_RATIO_WIDTH,
  OVERVIEW_FLEX_BREAK_WIDTH,
  TOKEN_ALLOCATION_WIDTH,
} from "../constants";
import { AssetRatioByChain } from "./AssetRatioByChain";
import { TokenAllocation } from "./TokenAllocation";

export const Overview: React.FC = () => {
  const { width } = useWindowDimensions();
  const isBreakPoint = width < OVERVIEW_FLEX_BREAK_WIDTH;

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap",
      }}
    >
      <AssetRatioByChain
        style={{
          paddingTop: 32,
          width: isBreakPoint ? "100%" : ASSET_RATIO_WIDTH,
          marginRight: isBreakPoint ? ASSET_RATIO_MARGIN_RIGHT : 0,
        }}
      />
      <TokenAllocation
        style={{
          paddingTop: 32,
          width: isBreakPoint ? "100%" : TOKEN_ALLOCATION_WIDTH,
        }}
      />
    </View>
  );
};

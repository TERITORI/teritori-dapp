import React, { Suspense } from "react";
import { useWindowDimensions, View } from "react-native";

import { AssetRatioByChain } from "./AssetRatioByChain";
import {
  ASSET_RATIO_MARGIN_RIGHT,
  ASSET_RATIO_WIDTH,
  OVERVIEW_FLEX_BREAK_WIDTH,
  TOKEN_ALLOCATION_WIDTH,
} from "../constants";

export const Overview: React.FC = () => {
  const { width } = useWindowDimensions();
  const isBreakPoint = width < OVERVIEW_FLEX_BREAK_WIDTH;

  const TokenAllocation = React.lazy(() =>
    import("./TokenAllocation").then((module) => ({
      default: module.TokenAllocation,
    })),
  );

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
      <Suspense fallback={<></>}>
        <TokenAllocation
          style={{
            paddingTop: 32,
            width: isBreakPoint ? "100%" : TOKEN_ALLOCATION_WIDTH,
          }}
        />
      </Suspense>
    </View>
  );
};

import React from "react";
import { View } from "react-native";

import { AssetRatioByChain } from "./AssetRatioByChain";
import { TokenAllocation } from "./TokenAllocation";

export const Overview: React.FC = () => {
  return (
    <View
      style={{
        paddingTop: 32,
        paddingBottom: 40,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <AssetRatioByChain />
      <TokenAllocation />
    </View>
  );
};

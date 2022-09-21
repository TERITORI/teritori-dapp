import React from "react";
import { View } from "react-native";

import { AssetRatioByChain } from "./AssetRatioByChain";
import { TokenAllocation } from "./TokenAllocation";

export const Overview: React.FC = () => {
  return (
    <View>
      <AssetRatioByChain />
      <TokenAllocation />
    </View>
  );
};

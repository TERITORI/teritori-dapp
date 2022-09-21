import React from "react";
import { View } from "react-native";

import { BrandText } from "../../../components/BrandText";

export const TotalAssets: React.FC = () => {
  return (
    <View>
      <BrandText style={{ marginBottom: 24 }}>Total Assets By</BrandText>
    </View>
  );
};

import React from "react";
import { View, useWindowDimensions } from "react-native";

import { BrandText } from "../../components/BrandText";

interface WalletHeaderProps {}

export const WalletHeader: React.FC<WalletHeaderProps> = () => {
  const { width } = useWindowDimensions();

  return (
    <View style={{ display: width < 900 ? "none" : "flex" }}>
      <BrandText
        style={{
          fontSize: 20,
        }}
      >
        Wallet manager
      </BrandText>
    </View>
  );
};

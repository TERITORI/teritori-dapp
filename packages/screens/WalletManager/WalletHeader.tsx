import React from "react";
import { View } from "react-native";

import { BrandText } from "../../components/BrandText";

interface WalletHeaderProps {}

export const WalletHeader: React.FC<WalletHeaderProps> = () => {
  return (
    <View>
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

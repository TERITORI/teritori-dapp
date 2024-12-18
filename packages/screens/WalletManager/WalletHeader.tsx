import React from "react";
import { View } from "react-native";

import { ScreenTitle } from "@/components/ScreenContainer/ScreenTitle";

interface WalletHeaderProps {}

export const WalletHeader: React.FC<WalletHeaderProps> = () => {
  return (
    <View>
      <ScreenTitle>Wallet manager</ScreenTitle>
    </View>
  );
};

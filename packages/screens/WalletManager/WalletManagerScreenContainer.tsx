import React from "react";
import { View } from "react-native";

import { WalletHeader } from "./WalletHeader";
import { WALLET_SCREEN_CONTAINER_MARGIN_HORIZONTAL } from "./constants";
import { ScreenContainer } from "../../components/ScreenContainer";

export const WalletManagerScreenContainer: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <ScreenContainer headerChildren={<WalletHeader />}>
      <View
        style={{
          marginHorizontal: WALLET_SCREEN_CONTAINER_MARGIN_HORIZONTAL,
        }}
      >
        {children}
      </View>
    </ScreenContainer>
  );
};

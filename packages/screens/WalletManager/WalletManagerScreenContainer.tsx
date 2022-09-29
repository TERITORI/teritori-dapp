import React from "react";
import { View } from "react-native";

import { ScreenContainer } from "../../components/ScreenContainer";
import { WalletHeader } from "./WalletHeader";
import { WalletSidebar } from "./WalletSidebar";
import { WALLET_SCREEN_CONTAINER_MARGIN_HORIZONTAL } from "./constants";

export const WalletManagerScreenContainer: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <ScreenContainer
      hideSidebar
      noMargin
      customSidebar={<WalletSidebar />}
      headerChildren={<WalletHeader />}
    >
      <View
        style={{
          marginVertical: 20,
          marginHorizontal: WALLET_SCREEN_CONTAINER_MARGIN_HORIZONTAL,
        }}
      >
        {children}
      </View>
    </ScreenContainer>
  );
};

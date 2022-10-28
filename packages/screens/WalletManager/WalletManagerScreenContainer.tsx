import React from "react";
import { View } from "react-native";

import { ScreenContainer } from "../../components/ScreenContainer";
import { Footer } from "../../components/footers/Footer";
import { WalletHeader } from "./WalletHeader";
import { WALLET_SCREEN_CONTAINER_MARGIN_HORIZONTAL } from "./constants";

export const WalletManagerScreenContainer: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <ScreenContainer
      headerChildren={<WalletHeader />}
      footerChildren={<Footer />}
    >
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

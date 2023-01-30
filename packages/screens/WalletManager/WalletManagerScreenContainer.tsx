import React from "react";
import { View } from "react-native";
import { useWindowDimensions } from "react-native";

import { ScreenContainer } from "../../components/ScreenContainer";
import { WalletHeader } from "./WalletHeader";
import { WALLET_SCREEN_CONTAINER_MARGIN_HORIZONTAL } from "./constants";
import { smallMobileWidth } from "../../utils/style/layout";

export const WalletManagerScreenContainer: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { width } = useWindowDimensions();

  return (
    <ScreenContainer noMargin={width <= 1600} headerChildren={<WalletHeader />}>
      <View
        style={{
          // marginHorizontal: WALLET_SCREEN_CONTAINER_MARGIN_HORIZONTAL,
          marginHorizontal:
            width < smallMobileWidth
              ? 12
              : WALLET_SCREEN_CONTAINER_MARGIN_HORIZONTAL,
        }}
      >
        {children}
      </View>
    </ScreenContainer>
  );
};

import React, { useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { ConnectWalletModal } from "./ConnectWalletModal";
import { PrimaryButton } from "../buttons/PrimaryButton";

export const MainConnectWalletButton: React.FC<{
  style?: StyleProp<ViewStyle>;
}> = ({ style }) => {
  const [isConnectWalletVisible, setIsConnectWalletVisible] = useState(false);
  return (
    <View style={style}>
      <PrimaryButton
        size="XL"
        text="Connect wallet"
        onPress={() => setIsConnectWalletVisible(true)}
      />
      <ConnectWalletModal
        visible={isConnectWalletVisible}
        onClose={() => setIsConnectWalletVisible(false)}
      />
    </View>
  );
};

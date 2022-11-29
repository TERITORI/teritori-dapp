import React, { useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { ButtonsSize } from "../../utils/style/buttons";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { ConnectWalletModal } from "./ConnectWalletModal";

export const MainConnectWalletButton: React.FC<{
  size?: ButtonsSize;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}> = ({ size = "XL", fullWidth, style }) => {
  const [isConnectWalletVisible, setIsConnectWalletVisible] = useState(false);
  return (
    <View style={style}>
      <PrimaryButton
        size={size}
        fullWidth={fullWidth}
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

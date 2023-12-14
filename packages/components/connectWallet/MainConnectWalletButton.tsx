import React, { useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { NetworkFeature } from "../../networks";
import { ButtonsSize } from "../../utils/style/buttons";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { ConnectWalletModal } from "../modals/ConnectWalletModal";

export const MainConnectWalletButton: React.FC<{
  style?: StyleProp<ViewStyle>;
  size?: ButtonsSize;
  forceNetworkFeature?: NetworkFeature;
}> = ({ style, forceNetworkFeature, size = "XL" }) => {
  const [isConnectWalletVisible, setIsConnectWalletVisible] = useState(false);

  return (
    <View style={style}>
      <PrimaryButton
        size={size}
        text="Connect wallet"
        onPress={() => setIsConnectWalletVisible(true)}
      />
      <ConnectWalletModal
        forceNetworkFeature={forceNetworkFeature}
        visible={isConnectWalletVisible}
        onClose={() => setIsConnectWalletVisible(false)}
      />
    </View>
  );
};

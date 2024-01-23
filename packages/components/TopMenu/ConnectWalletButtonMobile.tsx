import React, { FC, useState } from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";

import { TopMenuMobile } from "./TopMenuMobile";
import contactsSVG from "../../../assets/icons/contacts.svg";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { neutral17, neutral33 } from "../../utils/style/colors";
import { SVG } from "../SVG";
import { ConnectWalletModal } from "../connectWallet/ConnectWalletModal";

export const ConnectWalletButtonMobile: FC<{
  style?: StyleProp<ViewStyle>;
}> = ({ style }) => {
  const selectedWallet = useSelectedWallet();
  const [isConnectWalletVisible, setIsConnectWalletVisible] = useState(false);

  // functions
  const toggleConnectWallet = () =>
    setIsConnectWalletVisible(!isConnectWalletVisible);

  return (
    <>
      <View style={style}>
        {selectedWallet ? (
          <TopMenuMobile />
        ) : (
          <TouchableOpacity onPress={toggleConnectWallet}>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 999,
                width: 32,
                height: 32,
                backgroundColor: neutral17,
                borderColor: neutral33,
                borderWidth: 1,
              }}
            >
              <SVG width={16} height={16} source={contactsSVG} />
            </View>
          </TouchableOpacity>
        )}
      </View>
      <ConnectWalletModal
        visible={isConnectWalletVisible}
        onClose={toggleConnectWallet}
      />
    </>
  );
};

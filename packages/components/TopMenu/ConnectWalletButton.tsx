import React, { FC, useState } from "react";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";

import { TopMenu } from "./TopMenu";
import secondaryCardSmSVG from "../../../assets/cards/secondary-card-sm.svg";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { ConnectWalletModal } from "../connectWallet/ConnectWalletModal";

const HEIGHT = 40;
const WIDTH = 220;

export const ConnectWalletButton: FC<{ style?: StyleProp<ViewStyle> }> = ({
  style,
}) => {
  // variables
  const selectedWallet = useSelectedWallet();
  const [isConnectWalletVisible, setIsConnectWalletVisible] = useState(false);

  // functions
  const toggleConnectWallet = () =>
    setIsConnectWalletVisible(!isConnectWalletVisible);

  // returns
  return (
    <>
      <View style={style}>
        {selectedWallet ? (
          <TopMenu />
        ) : (
          <Pressable onPress={toggleConnectWallet}>
            <SVG
              width={WIDTH}
              height={HEIGHT}
              source={secondaryCardSmSVG}
              style={{ position: "absolute" }}
            />

            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                height: HEIGHT,
                minHeight: HEIGHT,
                width: WIDTH,
                minWidth: WIDTH,
              }}
            >
              <BrandText style={fontSemibold14}>Connect wallet</BrandText>
            </View>
          </Pressable>
        )}
      </View>
      <ConnectWalletModal
        visible={isConnectWalletVisible}
        onClose={toggleConnectWallet}
      />
    </>
  );
};

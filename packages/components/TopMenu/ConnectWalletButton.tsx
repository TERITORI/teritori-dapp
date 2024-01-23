import React, { FC, useState } from "react";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import { ActivityIndicator } from "react-native-paper";

import { TopMenu } from "./TopMenu";
import secondaryCardSmSVG from "../../../assets/cards/secondary-card-sm.svg";
import { useWallets } from "../../context/WalletsProvider";
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
  const selectedWallet = useSelectedWallet();
  const [isConnectWalletVisible, setIsConnectWalletVisible] = useState(false);
  const { ready } = useWallets();

  // functions
  const toggleConnectWallet = () =>
    setIsConnectWalletVisible(!isConnectWalletVisible);

  return (
    <>
      <View style={style}>
        {selectedWallet ? (
          <TopMenu />
        ) : (
          <Pressable
            onPress={ready ? toggleConnectWallet : undefined}
            disabled={!ready}
          >
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
              {ready ? (
                <BrandText style={fontSemibold14}>Connect wallet</BrandText>
              ) : (
                <ActivityIndicator size={fontSemibold14.fontSize} />
              )}
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

import React, { useState } from "react";
import { View, TouchableOpacity, ViewStyle } from "react-native";

import secondaryCardSmSVG from "../../assets/cards/secondary-card-sm.svg";
import logoTopSVG from "../../assets/logos/logo-hexagon.svg";
import { useAreThereWallets } from "../hooks/useAreThereWallets";
import { useAppNavigation } from "../utils/navigation";
import { neutral33 } from "../utils/style/colors";
import {
  headerHeight,
  screenContainerContentMarginHorizontal,
} from "../utils/style/layout";
import { BrandText } from "./BrandText";
import { SVG } from "./SVG";
import { WalletSelector } from "./WalletSelector";
import { WalletsManager } from "./WalletsManager";

// Displayed when no wallet connected. Press to connect wallet
const ConnectWalletButton: React.FC<{
  style?: ViewStyle;
  onPress: () => void;
}> = ({ style, onPress }) => {
  const height = 40;
  const width = 220;

  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <SVG width={width} height={height} source={secondaryCardSmSVG} />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          height,
          minHeight: height,
          width,
          minWidth: width,
          position: "absolute",
        }}
      >
        <BrandText
          style={{
            fontSize: 14,
          }}
        >
          Connect wallet
        </BrandText>
      </View>
    </TouchableOpacity>
  );
};

export const Header: React.FC<{
  style?: ViewStyle;
}> = ({ children, style }) => {
  const [walletsManagerVisible, setWalletsManagerVisible] = useState(false);
  const isAConnectedWallet = useAreThereWallets();
  const navigation = useAppNavigation();
  const headerMarginH = 22;

  return (
    <View
      style={[
        {
          height: headerHeight,
          maxHeight: headerHeight,
          width: "100%",
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottomColor: neutral33,
          borderBottomWidth: 1,
        },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        style={{ marginLeft: headerMarginH }}
      >
        <SVG width={68} height={68} source={logoTopSVG} />
      </TouchableOpacity>

      <View
        style={{
          width: "100%",
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          marginLeft: screenContainerContentMarginHorizontal,
        }}
      >
        <>{children}</>
      </View>

      {isAConnectedWallet ? (
        <WalletSelector
          style={{ marginRight: headerMarginH }}
          onPressAddWallet={() => navigation.navigate("Wallets")}
        />
      ) : (
        <ConnectWalletButton
          style={{ marginRight: headerMarginH }}
          onPress={() => setWalletsManagerVisible(true)}
        />
      )}

      <WalletsManager
        visible={walletsManagerVisible}
        onClose={() => setWalletsManagerVisible(false)}
      />
    </View>
  );
};

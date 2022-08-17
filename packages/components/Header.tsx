import React, { useState } from "react";
import { View, Image, TouchableOpacity, ViewStyle } from "react-native";

import secondaryCardSmPNG from "../../assets/cards/secondary-card-sm.png";
import logoTopPNG from "../../assets/logo-top.png";
import { useAreThereWallets } from "../hooks/useAreThereWallets";
import { useAppNavigation } from "../utils/navigation";
import { headerHeight } from "../utils/style/layout";
import { BrandText } from "./BrandText";
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
      <Image
        source={secondaryCardSmPNG}
        style={{ width, height, resizeMode: "stretch", position: "absolute" }}
      />

      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          height,
          minHeight: height,
          width,
          minWidth: width,
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

export const Header: React.FC = () => {
  const [walletsManagerVisible, setWalletsManagerVisible] = useState(false);
  const isAConnectedWallet = useAreThereWallets();
  const navigation = useAppNavigation();
  const headerMarginH = 22;

  return (
    <View
      style={{
        height: headerHeight,
        maxHeight: headerHeight,
        width: "100%",
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Image
          source={logoTopPNG}
          style={{
            width: 68,
            height: 68,
            resizeMode: "contain",
            marginLeft: headerMarginH,
          }}
        />
      </TouchableOpacity>

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

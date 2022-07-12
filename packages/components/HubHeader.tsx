import React from "react";
import { View } from "react-native";

import { neutral33 } from "../utils/colors";
import {
  AppNavigationProp,
  getCurrentRouteName,
  useAppNavigation,
} from "../utils/navigation";
import { WalletProvider } from "../utils/walletProvider";
import { BrandText } from "./BrandText";
import { WalletSelector } from "./WalletSelector";
import { useWallets } from "./WalletsProvider";

export const headerHeight = 80;

const headerName = (navigation: AppNavigationProp) => {
  const currentRoutName = getCurrentRouteName(navigation);
  if (["Activities", "MyCollection", "Guardians"].includes(currentRoutName)) {
    return "My Home Hub";
  }
  return currentRoutName;
};

export const HubHeader: React.FC = () => {
  const navigation = useAppNavigation();
  const { wallets } = useWallets();
  const headerNameFontSize = 20;
  if (
    wallets.filter(
      (wallet) => wallet.connected || wallet.provider === WalletProvider.Store
    ).length > 0
  ) {
    return (
      <View
        style={{
          borderBottomColor: neutral33,
          borderBottomWidth: 1,
          width: "100%",
          alignItems: "center",
          flexDirection: "row",
          paddingHorizontal: 25,
          height: headerHeight,
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
            borderRightColor: neutral33,
            borderRightWidth: 1,
            height: "100%",
            paddingRight: 16,
          }}
        >
          <BrandText
            style={{
              fontSize: headerNameFontSize,
              letterSpacing: -(headerNameFontSize * 0.04),
            }}
          >
            {headerName(navigation)}
          </BrandText>
          <BrandText>Search</BrandText>
        </View>
        <View
          style={{
            flexDirection: "row",
            paddingLeft: 16,
            alignItems: "center",
          }}
        >
          <BrandText style={{ marginRight: 12 }}>Bell</BrandText>
          <WalletSelector
            onPressAddWallet={() => navigation.navigate("Wallets")}
          />
        </View>
      </View>
    );
  }
  return null;
};

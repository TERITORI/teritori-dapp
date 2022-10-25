import { useRoute } from "@react-navigation/native";
import React from "react";
import { View, TouchableOpacity } from "react-native";
import { SvgProps } from "react-native-svg";

import chainWhiteSVG from "../../../assets/icons/chain.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { useAppNavigation } from "../../utils/navigation";
import { neutral33, neutralA3 } from "../../utils/style/colors";
import { WALLET_SIDEBAR_WIDTH } from "./constants";

type ListItem = {
  activeIcon: React.FC<SvgProps>;
  inactiveIcon: React.FC<SvgProps>;
  title: string;
  routeName: "WalletManager" | "WalletManagerWallets" | "WalletManagerChains";
};

const LIST: ListItem[] = [
  {
    activeIcon: chainWhiteSVG,
    inactiveIcon: chainWhiteSVG,
    title: "My Dashboard",
    routeName: "WalletManager",
  },
  {
    activeIcon: chainWhiteSVG,
    inactiveIcon: chainWhiteSVG,
    title: "Wallets",
    routeName: "WalletManagerWallets",
  },
  {
    activeIcon: chainWhiteSVG,
    inactiveIcon: chainWhiteSVG,
    title: "All Chains",
    routeName: "WalletManagerChains",
  },
];

export const WalletSidebar: React.FC = () => {
  const navigation = useAppNavigation();
  const { name: currentRouteName } = useRoute();

  return (
    <View
      style={{
        width: WALLET_SIDEBAR_WIDTH,
        borderRightWidth: 1,
        borderColor: neutral33,
        paddingTop: 36,
      }}
    >
      {LIST.map((item) => (
        <TouchableOpacity
          activeOpacity={0.7}
          key={item.title}
          style={{
            paddingVertical: 13,
            paddingHorizontal: 26,
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={() => navigation.navigate(item.routeName)}
        >
          <SVG
            source={
              currentRouteName === item.routeName
                ? item.activeIcon
                : item.inactiveIcon
            }
            height={28}
            width={28}
          />
          <BrandText
            style={{
              fontSize: 14,
              marginLeft: 14,
              color: currentRouteName === item.routeName ? "white" : neutralA3,
            }}
          >
            {item.title}
          </BrandText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

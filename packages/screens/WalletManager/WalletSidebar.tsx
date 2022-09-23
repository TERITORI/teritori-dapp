import React from "react";
import { View, TouchableOpacity } from "react-native";

import chainSVG from "../../../assets/icons/chain.svg";
import gridSVG from "../../../assets/icons/grid.svg";
import walletsSVG from "../../../assets/icons/wallets.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { getCurrentRouteName, useAppNavigation } from "../../utils/navigation";
import { neutral33, neutralA3 } from "../../utils/style/colors";

const LIST = [
  {
    icon: gridSVG,
    title: "My Dashboard",
    routeName: "WalletManager",
  },
  {
    icon: walletsSVG,
    title: "Wallets",
    routeName: "WalletManagerWallets",
  },
  {
    icon: chainSVG,
    title: "All Chains",
    routeName: "WalletManagerChains",
  },
];

export const WalletSidebar: React.FC = () => {
  const navigation = useAppNavigation();
  const currentRouteName = getCurrentRouteName(navigation);
  return (
    <View
      style={{
        width: 262,
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
            source={item.icon}
            height={28}
            width={28}
            color={currentRouteName === item.routeName ? "white" : neutralA3}
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

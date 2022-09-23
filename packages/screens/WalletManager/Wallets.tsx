import React from "react";
import { View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { neutral33 } from "../../utils/style/colors";
import { WalletItem } from "./WalletItem";
const WALLETS = [
  {
    title: "Teritori",
    staked: 535053.812943,
    pendingReward: 56469.54635563,
    address: "GxF3432432904320430SDSDSFDS@S>!3A31",
  },
  {
    title: "Cosmos Hub",
    staked: 535053.812943,
    pendingReward: 56469.54635563,
    address: "GxF3432432904320430SDSDSFDS@S>!3A31",
  },
  {
    title: "Terra",
    staked: 535053.812943,
    pendingReward: 56469.54635563,
    address: "GxF3432432904320430SDSDSFDS@S>!3A31",
  },
];
export const Wallets: React.FC = () => {
  return (
    <View
      style={{
        paddingTop: 40,
        borderTopWidth: 1,
        borderColor: neutral33,
      }}
    >
      <BrandText style={{ marginRight: 20, fontSize: 20 }}>Wallets</BrandText>

      {WALLETS.map((item, index) => (
        <WalletItem
          key={item.title}
          totalLength={WALLETS.length}
          item={item}
          index={index}
        />
      ))}
    </View>
  );
};

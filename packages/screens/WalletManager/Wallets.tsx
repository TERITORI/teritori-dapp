import React from "react";
import { View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { WALLETS } from "../../utils/fakeData/walletManager";
import { neutral33 } from "../../utils/style/colors";
import { WalletItem } from "./WalletItem";

export const Wallets: React.FC = () => {
  return (
    <View
      style={{
        paddingTop: 40,
        borderTopWidth: 1,
        borderColor: neutral33,
        zIndex: 99,
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

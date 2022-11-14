import React from "react";
import { View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { useRewards } from "../../hooks/useRewards";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { neutral33 } from "../../utils/style/colors";
import { WalletItem } from "./WalletItem";

export const Wallets: React.FC = () => {
  const selectedWallet = useSelectedWallet();

  const { totalAmount: totalAmountTeritori } = useRewards();

  const wallets = selectedWallet
    ? [
        {
          id: 0,
          title: "Teritori",
          address: selectedWallet.address,
          pendingReward: totalAmountTeritori || 0,
          staked: 42,
        },
      ]
    : [];

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

      {wallets.map((item, index) => (
        <WalletItem
          key={item.title}
          itemsCount={wallets.length}
          item={item}
          index={index}
        />
      ))}
    </View>
  );
};

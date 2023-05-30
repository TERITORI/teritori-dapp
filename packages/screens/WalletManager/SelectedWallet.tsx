import React from "react";
import { View } from "react-native";

import { WalletItem } from "./WalletItem";
import { BrandText } from "../../components/BrandText";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { neutral33 } from "../../utils/style/colors";

export const SelectedWallet: React.FC = () => {
  const selectedWallet = useSelectedWallet();

  if (!selectedWallet) {
    return null;
  }

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
      <WalletItem itemsCount={1} wallet={selectedWallet} index={0} />
    </View>
  );
};

import React from "react";
import { View } from "react-native";

import { WalletItem } from "./WalletItem";
import { BrandText } from "../../components/BrandText";
import { useRewards } from "../../hooks/useRewards";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getNetwork } from "../../networks";
import { neutral33 } from "../../utils/style/colors";

export const Wallets: React.FC = () => {
  const selectedWallet = useSelectedWallet();

  // TODO: Handle multiple wallets addresses
  const { totalsRewards } = useRewards(selectedWallet?.userId);

  const wallets = [];

  if (selectedWallet) {
    const network = getNetwork(selectedWallet.networkId);
    const wallet = {
      id: "0",
      title: network?.displayName || selectedWallet.networkId,
      address: selectedWallet.address,
      pendingRewards: totalsRewards,
      networkId: selectedWallet.networkId,
      staked: 42,
    };
    wallets.push(wallet);
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

      {wallets.map((item, index) => (
        <WalletItem
          key={item.title}
          itemsCount={wallets.length}
          wallet={item}
          index={index}
        />
      ))}
    </View>
  );
};

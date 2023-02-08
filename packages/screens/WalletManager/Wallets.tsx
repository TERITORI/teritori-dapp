import React from "react";
import { View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { useRewards } from "../../hooks/useRewards";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { neutral33 } from "../../utils/style/colors";
import { WalletTitle } from "../../utils/walletManagerHelpers";
import { WalletProvider } from "../../utils/walletProvider";
import { WalletItem } from "./WalletItem";

export const Wallets: React.FC = () => {
  const selectedWallet = useSelectedWallet();

  // TODO: Handle multiple wallets addresses
  const { totalsRewards, claimReward } = useRewards(selectedWallet?.address);

  const wallets = [];
  let title = "";

  if (selectedWallet) {
    switch (selectedWallet.provider) {
      case WalletProvider.Keplr:
        title = WalletTitle.Teritori;
        break;
      case WalletProvider.Metamask:
        title = WalletTitle.Ethereum;
        break;
    }

    const wallet = {
      id: 0,
      title,
      address: selectedWallet.address,
      pendingRewards: totalsRewards,
      claimReward,
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
          item={item}
          index={index}
        />
      ))}
    </View>
  );
};

import React from "react";
import { View } from "react-native";

import { Assets } from "./Assets";
import { MyNFTs } from "./MyNFTs";
import { WalletDashboardHeader } from "./WalletDashboardHeader";
import { Wallets } from "./Wallets";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { MainConnectWalletButton } from "../../components/connectWallet/MainConnectWalletButton";
import { useAreThereWallets } from "../../hooks/useAreThereWallets";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { neutral33 } from "../../utils/style/colors";
import { fontSemibold20 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

export const WalletManagerScreen: ScreenFC<"WalletManager"> = () => {
  const selectedWallet = useSelectedWallet();
  const areThereWallets = useAreThereWallets();
  const { height } = useMaxResolution();
  const navigation = useAppNavigation();

  return (
    <ScreenContainer
      headerChildren={
        <BrandText style={fontSemibold20}>Wallet Manager</BrandText>
      }
      responsive
      onBackPress={() => navigation.navigate("WalletManager")}
    >
      {areThereWallets ? (
        <View
          style={{
            flex: 1,
            paddingBottom: layout.contentSpacing,
          }}
        >
          <WalletDashboardHeader />
          <Assets
            userId={selectedWallet?.userId}
            style={{
              marginTop: 40,
              borderTopWidth: 1,
              borderColor: neutral33,
              paddingTop: 40,
            }}
          />
          <Wallets />
          <MyNFTs />
        </View>
      ) : (
        <View
          style={{
            height,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MainConnectWalletButton />
        </View>
      )}
    </ScreenContainer>
  );
};

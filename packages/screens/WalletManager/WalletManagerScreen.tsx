import React from "react";
import { StyleSheet, View } from "react-native";

import { ScreenContainer } from "../../components/ScreenContainer";
import { MainConnectWalletButton } from "../../components/connectWallet/MainConnectWalletButton";
import { useAreThereWallets } from "../../hooks/useAreThereWallets";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { ScreenFC } from "../../utils/navigation";
import { layout } from "../../utils/style/layout";
import { Assets } from "./Assets";
import { MyNFTs } from "./MyNFTs";
import { WalletDashboardHeader } from "./WalletDashboardHeader";
import { WalletHeader } from "./WalletHeader";
import { Wallets } from "./Wallets";

export const WalletManagerScreen: ScreenFC<"WalletManager"> = () => {
  const selectedWallet = useSelectedWallet();
  const areThereWallets = useAreThereWallets();
  const { height } = useMaxResolution();

  return (
    <ScreenContainer headerChildren={<WalletHeader />}>
      {areThereWallets ? (
        <View style={styles.container}>
          <WalletDashboardHeader />
          <Assets userId={selectedWallet?.userId} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: layout.contentPadding,
  },
});

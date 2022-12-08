import React from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

import { MainConnectWalletButton } from "../../components/connectWallet/MainConnectWalletButton";
import { useAreThereWallets } from "../../hooks/useAreThereWallets";
import { useBalances } from "../../hooks/useBalances";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { selectSelectedNetworkId } from "../../store/slices/settings";
import { ScreenFC } from "../../utils/navigation";
import { layout } from "../../utils/style/layout";
import { Assets } from "./Assets";
import { MyNFTs } from "./MyNFTs";
import { WalletDashboardHeader } from "./WalletDashboardHeader";
import { WalletManagerScreenContainer } from "./WalletManagerScreenContainer";
import { Wallets } from "./Wallets";

export const WalletManagerScreen: ScreenFC<"WalletManager"> = () => {
  const selectedWallet = useSelectedWallet();
  const selectedNetworkId = useSelector(selectSelectedNetworkId);
  const areThereWallets = useAreThereWallets();
  const { height } = useMaxResolution();
  const balances = useBalances(selectedNetworkId, selectedWallet?.address);

  return (
    <WalletManagerScreenContainer>
      {areThereWallets ? (
        <View style={styles.container}>
          <WalletDashboardHeader />
          <Assets networkId={selectedNetworkId} balances={balances} />
          <Wallets networkId={selectedNetworkId} />
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
    </WalletManagerScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: layout.contentPadding,
  },
});

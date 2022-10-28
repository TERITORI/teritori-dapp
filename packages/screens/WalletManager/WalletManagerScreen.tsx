import React from "react";
import { View } from "react-native";

import { MainConnectWalletButton } from "../../components/connectWallet/MainConnectWalletButton";
import { useAreThereWallets } from "../../hooks/useAreThereWallets";
import { useBalances } from "../../hooks/useBalances";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { ScreenFC } from "../../utils/navigation";
import { Assets } from "./Assets";
import { MyNFTs } from "./MyNFTs";
import { WalletDashboardHeader } from "./WalletDashboardHeader";
import { WalletManagerScreenContainer } from "./WalletManagerScreenContainer";
import { Wallets } from "./Wallets";

export const WalletManagerScreen: ScreenFC<"WalletManager"> = () => {
  const selectedWallet = useSelectedWallet();
  const selectedNetwork = useSelectedNetworkId();
  const areThereWallets = useAreThereWallets();
  const { height } = useMaxResolution();
  const balances = useBalances(selectedNetwork, selectedWallet?.address);
  return (
    <WalletManagerScreenContainer>
      {areThereWallets ? (
        <>
          <WalletDashboardHeader />
          <Assets networkId={selectedNetwork} balances={balances} />
          <Wallets />
          <MyNFTs />
        </>
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

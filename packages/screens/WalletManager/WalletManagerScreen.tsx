import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import { Tabs } from "../../components/tabs/Tabs";
import { ScreenFC } from "../../utils/navigation";
import { layout } from "../../utils/style/layout";
import { MyNFTs } from "./MyNFTs";
import { TotalAssets } from "./TotalAssets";
import { WalletDashboardHeader } from "./WalletDashboardHeader";
import { WalletManagerScreenContainer } from "./WalletManagerScreenContainer";
import { Wallets } from "./Wallets";
import { DepositWithdrawModal } from "./components/DepositWithdrawModal";
import { Overview } from "./components/Overview";

const screenTabItems = {
  overview: {
    name: "Overview",
  },
  nfts: {
    name: "NFTs",
  },
};

export const WalletManagerScreen: ScreenFC<"WalletManager"> = () => {
  // variables
  const [selectedTab, setSelectedTab] =
    useState<keyof typeof screenTabItems>("overview");
  const [isWithdrawVisible, setIsWithdrawVisible] = useState(false);
  const [isDepositVisible, setIsDepositVisible] = useState(false);

  // functions
  const toggleWithdrawVisible = () => setIsWithdrawVisible(!isWithdrawVisible);
  const toggleDepositVisible = () => setIsDepositVisible(!isDepositVisible);

  // return
  return (
    <WalletManagerScreenContainer>
      <View style={styles.container}>
        <WalletDashboardHeader />
        <Tabs
          items={screenTabItems}
          selected={selectedTab}
          onSelect={setSelectedTab}
          style={{ marginTop: 24, height: 40 }}
        />
        {selectedTab === "overview" && <Overview />}
        {selectedTab === "nfts" && <MyNFTs />}
        <TotalAssets
          onPressWithdraw={toggleWithdrawVisible}
          onPressDeposit={toggleDepositVisible}
        />
        <DepositWithdrawModal
          variation="deposit"
          onClose={toggleDepositVisible}
          isVisible={isDepositVisible}
        />
        <DepositWithdrawModal
          variation="withdraw"
          onClose={toggleWithdrawVisible}
          isVisible={isWithdrawVisible}
        />
        <Wallets />
      </View>
    </WalletManagerScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: layout.contentPadding,
    paddingTop: layout.contentPadding - 20,
  },
});

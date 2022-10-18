import React, { useState } from "react";

import { Tabs } from "../../components/tabs/Tabs";
import { ScreenFC } from "../../utils/navigation";
import { MyNFTs } from "./MyNFTs";
import { Overview } from "./Overview/Overview";
import { TotalAssets } from "./TotalAssets";
import { WalletDashboardHeader } from "./WalletDashboardHeader";
import { WalletManagerScreenContainer } from "./WalletManagerScreenContainer";
import { Wallets } from "./Wallets";

const screenTabItems = {
  overview: {
    name: "Overview",
  },
  nfts: {
    name: "NFTs",
  },
};

export const WalletManagerScreen: ScreenFC<"WalletManager"> = () => {
  const [selectedTab, setSelectedTab] =
    useState<keyof typeof screenTabItems>("overview");
  return (
    <WalletManagerScreenContainer>
      <WalletDashboardHeader />
      <Tabs
        items={screenTabItems}
        selected={selectedTab}
        onSelect={setSelectedTab}
        style={{ marginTop: 24, height: 40 }}
      />
      {selectedTab === "overview" && <Overview />}
      {selectedTab === "nfts" && <MyNFTs />}
      <TotalAssets />
      <Wallets />
    </WalletManagerScreenContainer>
  );
};

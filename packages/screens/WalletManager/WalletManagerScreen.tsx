import React from "react";

import { TabItem, Tabs, useTabs } from "../../components/tabs/Tabs";
import { ScreenFC } from "../../utils/navigation";
import { MyNFTs } from "./MyNFTs";
import { Overview } from "./Overview/Overview";
import { TotalAssets } from "./TotalAssets";
import { WalletDashboardHeader } from "./WalletDashboardHeader";
import { WalletManagerScreenContainer } from "./WalletManagerScreenContainer";
import { Wallets } from "./Wallets";

const screenTabItems: TabItem[] = [
  {
    label: "Overview",
    isSelected: true,
  },
  {
    label: "NFTs",
    isSelected: false,
  },
];

export const WalletManagerScreen: ScreenFC<"WalletManager"> = () => {
  const { onPressTabItem, tabItems, selectedTabItem } = useTabs(screenTabItems);
  return (
    <WalletManagerScreenContainer>
      <WalletDashboardHeader />
      <Tabs
        items={tabItems}
        style={{ marginTop: 24, height: 40 }}
        onPressTabItem={onPressTabItem}
      />
      {selectedTabItem.label === "Overview" && <Overview />}
      {selectedTabItem.label === "NFTs" && <MyNFTs />}
      <TotalAssets />
      <Wallets />
    </WalletManagerScreenContainer>
  );
};

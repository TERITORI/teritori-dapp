import React from "react";

import { ScreenContainer } from "../../components/ScreenContainer";
import { TabItem, Tabs, useTabs } from "../../components/tabs/Tabs";
import { MyNFTs } from "./MyNFTs";
import { Overview } from "./Overview/Overview";
import { TotalAssets } from "./TotalAssets";
import { WalletHeader } from "./WalletHeader";
import { WalletSidebar } from "./WalletSidebar";
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

export const WalletManagerScreen: React.FC = () => {
  const { onPressTabItem, tabItems, selectedTabItem } = useTabs(screenTabItems);
  return (
    <ScreenContainer hideSidebar customSidebar={<WalletSidebar />}>
      <WalletHeader />
      <Tabs
        items={tabItems}
        style={{ marginTop: 24 }}
        onPressTabItem={onPressTabItem}
      />
      {selectedTabItem.label === "Overview" && <Overview />}
      <TotalAssets />
      <Wallets />
      <MyNFTs />
    </ScreenContainer>
  );
};

import React from "react";

import { ScreenContainer } from "../../components/ScreenContainer";
import { MyNFTs } from "./MyNFTs";
import { Overview } from "./Overview/Overview";
import { TabView } from "./TabView";
import { TotalAssets } from "./TotalAssets";
import { WalletHeader } from "./WalletHeader";
import { Wallets } from "./Wallets";
import { WalletSidebar } from "./WalletSidebar";

export const WalletManagerScreen: React.FC = () => {
  return (
    <ScreenContainer hideSidebar customSidebar={<WalletSidebar />}>
      <WalletHeader />
      <TabView />
      <Overview />
      <TotalAssets />
      <Wallets />
      <MyNFTs />
    </ScreenContainer>
  );
};

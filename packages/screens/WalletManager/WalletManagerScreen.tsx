import React from "react";

import { ScreenContainer } from "../../components/ScreenContainer";
import { MyNFTs } from "./MyNFTs";
import { Overview } from "./Overview/Overview";
import { TabView } from "./TabView";
import { TotalAssets } from "./TotalAssets";
import { WalletHeader } from "./WalletHeader";
import { Wallets } from "./Wallets";

export const WalletManagerScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <WalletHeader />
      <TabView />
      <Overview />
      <TotalAssets />
      <Wallets />
      <MyNFTs />
    </ScreenContainer>
  );
};

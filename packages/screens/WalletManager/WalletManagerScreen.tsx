import React from "react";

import { ScreenContainer } from "../../components/ScreenContainer";
import { Overview } from "./Overview/Overview";
import { TotalAssets } from "./Overview/TotalAssets";
import { TabView } from "./TabView";
import { WalletHeader } from "./WalletHeader";

export const WalletManagerScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <WalletHeader />
      <TabView />
      <Overview />
      <TotalAssets />
    </ScreenContainer>
  );
};

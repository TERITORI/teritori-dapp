import React from "react";

import { ScreenContainer } from "../../components/ScreenContainer";
import { WalletHeader } from "./WalletHeader";
import { WalletSidebar } from "./WalletSidebar";

export const WalletManagerScreenContainer: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <ScreenContainer
      hideSidebar
      customSidebar={<WalletSidebar />}
      headerChildren={<WalletHeader />}
    >
      {children}
    </ScreenContainer>
  );
};

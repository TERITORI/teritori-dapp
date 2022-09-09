import React from "react";

import { ScreenContainer } from "../../components/ScreenContainer";
import { WalletHeader } from "./WalletHeader";

export const WalletManagerScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <WalletHeader />
    </ScreenContainer>
  );
};

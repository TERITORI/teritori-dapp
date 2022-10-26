import React from "react";

import { useBalances } from "../../hooks/useBalances";
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
  const balances = useBalances(selectedNetwork, selectedWallet?.publicKey);
  return (
    <WalletManagerScreenContainer>
      <WalletDashboardHeader />
      <Assets networkId={selectedNetwork} balances={balances} />
      <Wallets />
      <MyNFTs />
    </WalletManagerScreenContainer>
  );
};

import React from "react";

import { BlurScreenContainer } from "../layout/BlurScreenContainer";

import { useSelectedNativeWallet } from "@/hooks/wallet/useSelectedNativeWallet";
import { ShowWalletQR } from "@/screens/Mini/Wallet/components/ShowWalletQR";
import { ScreenFC } from "@/utils/navigation";
import { findByBaseDenom } from "@/utils/wallet/chain-registry";

export const DepositTORIScreen: ScreenFC<"MiniDepositTORI"> = ({
  navigation,
  route,
}) => {
  const selectedWallet = useSelectedNativeWallet();

  const { denom } = route.params;
  const onGotoSelectToken = () =>
    navigation.replace("MiniSelectToken", { navigateTo: "MiniDepositTORI" });

  const selectedToken = findByBaseDenom(denom)?.assets[0];
  if (!selectedToken) {
    return null;
  }

  return (
    <BlurScreenContainer
      title={`Deposit ${selectedToken.symbol}`}
      onGoBack={onGotoSelectToken}
    >
      <ShowWalletQR selectedWallet={selectedWallet} />
    </BlurScreenContainer>
  );
};

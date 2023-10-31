import React from "react";

import { DAppCard } from "./DAppCard";
import walletSVG from "../../../assets/icons/wallet.svg";
import { useWallets } from "../../context/WalletsProvider";

export const MyWalletsCard: React.FC<{ onPress?: () => void }> = ({
  onPress,
}) => {
  const { wallets } = useWallets();

  const connectedWalletsCount = wallets.filter(
    (wallet) => wallet.address,
  ).length;

  return (
    <DAppCard
      label="My Wallets"
      description="IBC & Multichain Wallets
Connect & Manage"
      info={`${
        connectedWalletsCount > 0 ? connectedWalletsCount : "No"
      } wallet${connectedWalletsCount > 1 ? "s" : ""} connected`}
      iconSVG={walletSVG}
      onPress={onPress}
    />
  );
};

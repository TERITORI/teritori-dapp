import React from "react";
import { View } from "react-native";

import keplrSVG from "../../assets/icons/keplr.svg";
import { WalletProvider } from "../utils/walletProvider";
import { SVG } from "./SVG";

export const WalletProviderIcon: React.FC<{
  walletProvider: WalletProvider | null | undefined;
  size?: number;
}> = ({ walletProvider, size = 16 }) => {
  switch (walletProvider) {
    case WalletProvider.Keplr:
      return <SVG width={size} height={size} source={keplrSVG} />;

    default:
      return <View style={{ width: size, height: size }} />;
  }
};

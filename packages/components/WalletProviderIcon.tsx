import React from "react";
import { View } from "react-native";

import { SVG } from "./SVG";
import adenaSVG from "../../assets/icons/adena.svg";
import keplrSVG from "../../assets/icons/keplr.svg";
import metamaskSVG from "../../assets/icons/metamask.svg";
import { WalletProvider } from "../utils/walletProvider";

export const WalletProviderIcon: React.FC<{
  walletProvider: WalletProvider | null | undefined;
  size?: number;
}> = ({ walletProvider, size = 16 }) => {
  switch (walletProvider) {
    case WalletProvider.Keplr:
      return <SVG width={size} height={size} source={keplrSVG} />;
    case WalletProvider.Metamask:
      return <SVG width={size} height={size} source={metamaskSVG} />;
    case WalletProvider.Adena:
      return <SVG width={size} height={size} source={adenaSVG} />;
    default:
      return <View style={{ width: size, height: size }} />;
  }
};

import React from "react";
import { View } from "react-native";

import solanaCircleSVG from "../../assets/icons/solana-circle.svg";
import solanaSVG from "../../assets/icons/solana.svg";
import teritoriCircleSVG from "../../assets/icons/teritori-circle.svg";
import teritoriSVG from "../../assets/icons/teritori.svg";
import { Network } from "../utils/network";
import { SVG } from "./SVG";

export const NetworkIcon: React.FC<{
  network: Network;
  circle?: boolean;
  size?: number;
}> = ({ network, circle, size = 16 }) => {
  switch (network) {
    case Network.Solana:
      return (
        <SVG
          width={size}
          height={size}
          source={circle ? solanaCircleSVG : solanaSVG}
        />
      );
    case Network.Teritori:
      return (
        <SVG
          width={size}
          height={size}
          source={circle ? teritoriCircleSVG : teritoriSVG}
        />
      );
    default:
      return <View style={{ width: size, height: size }} />;
  }
};

import React from "react";
import { View } from "react-native";

import atomCircleSVG from "../../assets/icons/networks/cosmos-hub-circle.svg";
import atomSVG from "../../assets/icons/networks/cosmos-hub.svg";
import ethereumCircleSVG from "../../assets/icons/networks/ethereum-circle.svg";
import ethereumSVG from "../../assets/icons/networks/ethereum.svg";
import junoSVG from "../../assets/icons/networks/juno.svg";
import osmosisSVG from "../../assets/icons/networks/osmosis.svg";
import solanaCircleSVG from "../../assets/icons/networks/solana-circle.svg";
import solanaSVG from "../../assets/icons/networks/solana.svg";
import teritoriCircleSVG from "../../assets/icons/networks/teritori-circle.svg";
import teritoriSVG from "../../assets/icons/networks/teritori.svg";
import { Network } from "../../utils/network";
import { SVG } from "../SVG";

export const NetworkIcon: React.FC<{
  network: Network | null | undefined;
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
    case Network.Atom:
      return (
        <SVG
          width={size}
          height={size}
          source={circle ? atomCircleSVG : atomSVG}
        />
      );
    case Network.Juno:
      return <SVG width={size} height={size} source={junoSVG} />;
    case Network.Osmosis:
      return <SVG width={size} height={size} source={osmosisSVG} />;
    case Network.Ethereum:
      return (
        <SVG
          width={size}
          height={size}
          source={circle ? ethereumCircleSVG : ethereumSVG}
        />
      );
    default:
      return <View style={{ width: size, height: size }} />;
  }
};

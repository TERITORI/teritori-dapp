import React from "react";
import { Image, View } from "react-native";

import solanaCirclePNG from "../../assets/icons/solana-circle.png";
import solanaPNG from "../../assets/icons/solana.png";
import teritoriCirclePNG from "../../assets/icons/teritori-circle.png";
import teritoriPNG from "../../assets/icons/teritori.png";
import { Network } from "../utils/network";

export const NetworkIcon: React.FC<{
  network: Network;
  circle?: boolean;
  size?: number;
}> = ({ network, circle, size = 16 }) => {
  switch (network) {
    case Network.Solana:
      return (
        <Image
          source={circle ? solanaCirclePNG : solanaPNG}
          style={{ width: size, height: size, resizeMode: "contain" }}
        />
      );
    case Network.Teritori:
      return (
        <Image
          source={circle ? teritoriCirclePNG : teritoriPNG}
          style={{ width: size, height: size, resizeMode: "contain" }}
        />
      );
    default:
      return <View style={{ width: size, height: size }} />;
  }
};

import React from "react";
import { ImageBackground } from "react-native";

import disconnect from "../../assets/background/disconnect.png";
import login from "../../assets/background/login.png";
import price from "../../assets/background/price.png";
import score from "../../assets/background/score.png";
import winorlose from "../../assets/background/winorlose.png";

const baseStyle = { flex: 1 };

const imgComponent = {
  disconnect: { src: disconnect, style: { ...baseStyle } },
  login: { src: login, style: { ...baseStyle, filter: "sepia(1)" } },
  price: { src: price, style: { ...baseStyle } },
  score: { src: score, style: { ...baseStyle } },
  winorlose: { src: winorlose, style: { ...baseStyle } },
};

export const DefaultBackground: React.FC<{
  children: JSX.Element;
  type: string;
}> = ({ children, type }) => {
  const selectedComponnet = (imgComponent as any)[type];

  return (
    <ImageBackground
      source={selectedComponnet.src}
      resizeMode="cover"
      style={selectedComponnet.style}
    >
      {children}
    </ImageBackground>
  );
};

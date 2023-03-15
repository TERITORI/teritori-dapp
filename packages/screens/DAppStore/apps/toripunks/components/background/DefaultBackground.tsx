import React from "react";
import { ImageBackground } from "react-native";

import disconnect from "../../assets/background/disconnect.png";
import login from "../../assets/background/login.png";
import main from "../../assets/background/main.png";
import price from "../../assets/background/price.png";
import score from "../../assets/background/score.png";
import winorlose from "../../assets/background/winorlose.png";

const baseStyle = { flex: 1 };

const imgComponent = {
  disconnect: { src: disconnect, style: { ...baseStyle }, imgStyle: {} },
  main: { src: main, style: { ...baseStyle }, imgStyle: {} },
  login: {
    src: login,
    style: { ...baseStyle },
    imgStyle: { filter: "sepia(1)" },
  },
  price: { src: price, style: { ...baseStyle }, imgStyle: {} },
  score: { src: score, style: { ...baseStyle }, imgStyle: {} },
  winorlose: { src: winorlose, style: { ...baseStyle }, imgStyle: {} },
};

export const DefaultBackground: React.FC<{
  children: JSX.Element;
  type: string;
}> = ({ children, type }) => {
  const selectedComponnet = (imgComponent as any)[type];

  return (
    <ImageBackground
      imageStyle={selectedComponnet.imgStyle}
      source={selectedComponnet.src}
      resizeMode="cover"
      style={selectedComponnet.style}
    >
      {children}
    </ImageBackground>
  );
};

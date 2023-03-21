import React from "react";
import { ImageBackground } from "react-native";

import { imgComponent } from "./BackgroundStyleData";

export const DefaultBackground: React.FC<{
  children: JSX.Element;
  type: string;
}> = ({ children, type }) => {
  const selectedComponnet = (imgComponent as any)[type];

  return (
    <ImageBackground
      imageStyle={selectedComponnet.imgStyle}
      source={selectedComponnet.src}
      resizeMode={selectedComponnet.resizeMode}
      style={selectedComponnet.style}
    >
      {children}
    </ImageBackground>
  );
};

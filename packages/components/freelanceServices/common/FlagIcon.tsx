import React from "react";
import { Image } from "react-native";

export const FlagIcon: React.FC<{ alphaCode: string }> = ({ alphaCode }) => (
  <Image
    source={{
      uri: `https://flagcdn.com/w20/${alphaCode}.png`,
    }}
    style={{ width: 21, height: 15, marginRight: 8 }}
  />
);

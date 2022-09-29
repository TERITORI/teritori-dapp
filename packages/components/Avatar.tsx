// libraries
import React from "react";
import { Image } from "react-native";

import { avatarWidth } from "../utils/style/layout";

// types
export interface AvatarProps {
  uri: string;
  size?: "regular" | "medium";
}

export const Avatar: React.FC<AvatarProps> = ({ uri, size = "regular" }) => {
  // functions
  const getSize = () => {
    switch (size) {
      case "medium":
        return avatarWidth * 1.2;

      default:
        return avatarWidth;
    }
  };

  // variables
  const avatarSize = getSize();

  // renders
  return (
    <Image
      source={{
        uri,
      }}
      style={{
        width: avatarSize,
        height: avatarSize,
        borderRadius: avatarSize / 2,
      }}
    />
  );
};

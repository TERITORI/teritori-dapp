// libraries
import React from "react";
import { Image } from "react-native";

import { AVATAR_WIDTH } from "../utils/variables";

// types
export interface AvatarProps {
  uri: string;
  size?: "regular" | "medium";
}

export const Avatar = ({ uri, size = "regular" }: AvatarProps) => {
  // functions
  const getSize = () => {
    switch (size) {
      case "medium":
        return AVATAR_WIDTH * 1.2;

      default:
        return AVATAR_WIDTH;
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

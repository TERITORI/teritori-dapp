// libraries
import React from "react";
import styled from "styled-components/native";

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
      size={avatarSize}
    />
  );
};

interface ImageProps {
  size: number;
}

const Image = styled.Image(({ size }: ImageProps) => ({
  width: size,
  height: size,
  borderRadius: size / 2,
}));

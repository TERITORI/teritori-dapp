// libraries
import React from "react";
import { SvgProps } from "react-native-svg";

import { avatarWidth } from "../utils/style/layout";
import { OptimizedImage } from "./OptimizedImage";
import { SVG } from "./SVG";

// types
export interface AvatarProps {
  uri?: string;
  size?: "regular" | "medium";
  defaultIcon?: React.FC<SvgProps>;
}

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  size = "regular",
  defaultIcon,
}) => {
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
  return uri ? (
    <OptimizedImage
      width={avatarSize}
      height={avatarSize}
      source={{
        uri,
      }}
      style={{
        width: avatarSize,
        height: avatarSize,
        borderRadius: avatarSize / 2,
      }}
    />
  ) : defaultIcon ? (
    <SVG source={defaultIcon} width={avatarSize} height={avatarSize} />
  ) : null;
};

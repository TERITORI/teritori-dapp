import React from "react";
import { SvgProps } from "react-native-svg";

import { OptimizedImage } from "./OptimizedImage";
import { SVG } from "./SVG";
import { avatarWidth } from "../utils/style/layout";

// types
interface AvatarProps {
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

  const avatarSize = getSize();

  // renders
  return uri ? (
    <OptimizedImage
      width={avatarSize}
      height={avatarSize}
      sourceURI={uri}
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

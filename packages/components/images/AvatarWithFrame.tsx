import React from "react";
import { Image, StyleProp, View, ViewStyle } from "react-native";

import userImageFrameSVG from "../../../assets/user-image-frame.svg";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { SVG } from "../SVG";

interface AvatarWithFrameProps {
  image: string | null | undefined;
  style?: StyleProp<ViewStyle>;
  size?: number;
}

export const AvatarWithFrame: React.FC<AvatarWithFrameProps> = ({
  image,
  style,
  size = 92,
}) => {
  return (
    <View style={style}>
      <Image
        source={{
          uri: ipfsURLToHTTPURL(
            image
              ? image
              : process.env.TERITORI_NAME_SERVICE_DEFAULT_IMAGE_URL || ""
          ),
        }} // TODO: proper fallback
        style={[
          {
            top: size * 0.24,
            left: size * 0.24,
            zIndex: 2,
            position: "absolute",
            borderRadius: 24,
            width: size,
            height: size,
          },
        ]}
      />
      <SVG
        source={userImageFrameSVG}
        width={size * 1.51}
        height={size * 1.51}
      />
    </View>
  );
};

import React from "react";
import {
  ActivityIndicator,
  Image,
  ImageStyle,
  Pressable,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";

import userImageFrameSVG from "../../../assets/user-image-frame.svg";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { SVG } from "../SVG";
import { AnimationFadeIn } from "../animations";

interface AvatarWithFrameProps {
  image: string | null | undefined;
  style?: StyleProp<ViewStyle>;
  size?: number;
  isLoading?: boolean;
  onPress?(): void;
}

export const AvatarWithFrame: React.FC<AvatarWithFrameProps> = ({
  image,
  style,
  size = 92,
  isLoading,
  onPress,
}) => {
  const sizeStyle: ImageStyle = {
    top: size * 0.24,
    left: size * 0.24,
    zIndex: 2,
    position: "absolute",
    borderRadius: 24,
    width: size,
    height: size,
    justifyContent: "center",
  };

  return (
    <Pressable style={style} onPress={onPress}>
      {isLoading ? (
        <View style={sizeStyle}>
          <ActivityIndicator />
        </View>
      ) : (
        <AnimationFadeIn>
          <Image
            source={{
              uri: ipfsURLToHTTPURL(
                image
                  ? image
                  : process.env.TERITORI_NAME_SERVICE_DEFAULT_IMAGE_URL || ""
              ),
            }} // TODO: proper fallback
            style={sizeStyle}
          />
        </AnimationFadeIn>
      )}
      <SVG
        source={userImageFrameSVG}
        width={size * 1.51}
        height={size * 1.51}
      />
    </Pressable>
  );
};

import React, { useMemo } from "react";
import {
  Image,
  StyleProp,
  View,
  ViewStyle,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import userImageFrameSVG from "../../../assets/user-image-frame.svg";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { SVG } from "../SVG";
import { AnimationFadeIn } from "../animations";

type AvatarWithFrameSize = "XL" | "L" | "M";

export const AvatarWithFrame: React.FC<{
  image: string | null | undefined;
  size: AvatarWithFrameSize;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
}> = ({ image, size, isLoading, style }) => {
  const sizedStyles = useMemo(
    () => StyleSheet.flatten(flatStyles[size]),
    [size]
  );

  return (
    <View style={[styles.container, style]}>
      <SVG
        source={userImageFrameSVG}
        width={sizedStyles.frame.width}
        height={sizedStyles.frame.height}
      />

      {isLoading ? (
        <ActivityIndicator
          size={sizedStyles.image.width * 0.5}
          style={styles.absolute}
        />
      ) : (
        <AnimationFadeIn style={styles.absolute}>
          <Image
            resizeMode="contain"
            source={{
              uri: ipfsURLToHTTPURL(
                image
                  ? image
                  : process.env.TERITORI_NAME_SERVICE_DEFAULT_IMAGE_URL || ""
              ),
            }}
            style={sizedStyles.image}
          />
        </AnimationFadeIn>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  absolute: {
    position: "absolute",
    zIndex: 2,
  },
});

const flatStyles = {
  XL: {
    image: {
      width: 132,
      height: 132,
      borderRadius: 24,
    },
    frame: {
      width: 196,
      height: 196,
    },
  },

  L: {
    image: {
      width: 62,
      height: 62,
      borderRadius: 11,
    },
    frame: {
      width: 92,
      height: 92,
    },
  },

  M: {
    image: {
      width: 46,
      height: 46,
      borderRadius: 8,
    },
    frame: {
      width: 68,
      height: 68,
    },
  },
};

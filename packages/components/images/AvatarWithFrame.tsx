import React, { useMemo } from "react";
import {
  Image,
  StyleProp,
  View,
  ViewStyle,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import emptyCircleFrameSVG from "../../../assets/empty-circle-frame.svg";
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
        source={emptyCircleFrameSVG}
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
      height: 138,
      width: 138,
      left: 1,
      top: -1,
      borderRadius: 999,
    },
    frame: {
      width: 196,
      height: 196,
    },
  },

  L: {
    image: {
      height: 64,
      width: 64,
      left: 0.5,
      top: -0.5,
      borderRadius: 999,
    },
    frame: {
      width: 92,
      height: 92,
    },
  },

  M: {
    image: {
      height: 48,
      left: 0.5,
      top: -0.5,
      width: 48,
      borderRadius: 999,
    },
    frame: {
      width: 68,
      height: 68,
    },
  },
};

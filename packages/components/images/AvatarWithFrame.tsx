import React, { useMemo } from "react";
import {
  StyleProp,
  View,
  ViewStyle,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import emptyCircleFrameSVG from "../../../assets/empty-circle-frame.svg";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { getCosmosNetwork } from "../../networks";
import { OptimizedImage } from "../OptimizedImage";
import { SVG } from "../SVG";
import { AnimationFadeIn } from "../animations/AnimationFadeIn";

type AvatarWithFrameSize = "XL" | "L" | "M" | "S";

export const AvatarWithFrame: React.FC<{
  image: string | null | undefined;
  size: AvatarWithFrameSize;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
}> = ({ image, size, isLoading, style }) => {
  const networkId = useSelectedNetworkId();
  const network = getCosmosNetwork(networkId);
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
          <OptimizedImage
            width={sizedStyles.image.width}
            height={sizedStyles.image.height}
            source={{
              uri: image ? image : network?.nameServiceDefaultImage || "",
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

  S: {
    image: {
      height: 24,
      left: 0.5,
      top: -0.5,
      width: 24,
      borderRadius: 999,
    },
    frame: {
      width: 24,
      height: 24,
    },
  },
};

import React, { useMemo } from "react";
import {
  StyleProp,
  View,
  ViewStyle,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import emptyCircleFrameSVG from "../../../assets/empty-circle-frame.svg";
import { useIsDAO } from "../../hooks/cosmwasm/useCosmWasmContractInfo";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { getCosmosNetwork } from "../../networks";
import { primaryColor } from "../../utils/style/colors";
import { OptimizedImage } from "../OptimizedImage";
import { SVG } from "../SVG";
import { AnimationFadeIn } from "../animations/AnimationFadeIn";

type AvatarWithFrameSize = "XL" | "L" | "M" | "S" | "XS";

export const AvatarWithFrame: React.FC<{
  userId: string | undefined;
  size?: AvatarWithFrameSize;
  style?: StyleProp<ViewStyle>;
}> = ({ userId, size = "M", style }) => {
  const networkId = useSelectedNetworkId();
  const network = getCosmosNetwork(networkId);
  const sizedStyles = useMemo(
    () => StyleSheet.flatten(flatStyles[size]),
    [size]
  );
  const {
    metadata: { image },
    loading: isLoading,
  } = useNSUserInfo(userId);
  const { isDAO } = useIsDAO(userId);

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
            width={sizedStyles.image.width} // FIXME: use discrete sizing
            height={sizedStyles.image.height} // FIXME: use discrete sizing
            source={{
              uri: image ? image : network?.nameServiceDefaultImage || "",
            }}
            style={[
              sizedStyles.image,
              isDAO && {
                borderRadius: sizedStyles.image.width * 0.05,
                borderWidth: sizedStyles.image.width * 0.02,
                borderColor: primaryColor,
              },
            ]}
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
      height: 34,
      left: 0.25,
      top: -0.5,
      width: 34,
      borderRadius: 999,
    },
    frame: {
      width: 48,
      height: 48,
    },
  },

  XS: {
    image: {
      height: 25,
      left: 0.25,
      top: -0.5,
      width: 25,
      borderRadius: 999,
    },
    frame: {
      width: 38,
      height: 38,
    },
  },
};

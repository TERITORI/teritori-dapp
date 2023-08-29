import React, { useMemo } from "react";
import { StyleProp, View, ViewStyle, StyleSheet } from "react-native";

import emptyCircleFrameSVG from "../../../assets/empty-circle-frame.svg";
import { useIsDAO } from "../../hooks/cosmwasm/useCosmWasmContractInfo";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import {
  CosmosNetworkInfo,
  GnoNetworkInfo,
  NetworkKind,
  getNetwork,
  parseUserId,
} from "../../networks";
import { primaryColor } from "../../utils/style/colors";
import { OptimizedImage } from "../OptimizedImage";
import { SVG } from "../SVG";
import { AnimationFadeIn } from "../animations/AnimationFadeIn";

type AvatarWithFrameSize = "XL" | "L" | "M" | "S" | "XS";

export const UserAvatarWithFrame: React.FC<{
  userId: string | undefined;
  size?: AvatarWithFrameSize;
  style?: StyleProp<ViewStyle>;
}> = ({ userId, size = "M", style }) => {
  const [network] = parseUserId(userId);
  const {
    metadata: { image },
  } = useNSUserInfo(userId);
  const { isDAO } = useIsDAO(userId);

  return (
    <AvatarWithFrame
      networkId={network?.id}
      image={image}
      isDAO={isDAO}
      size={size}
      style={style}
    />
  );
};

export const AvatarWithFrame: React.FC<{
  networkId: string | undefined;
  image: string | null | undefined;
  size?: AvatarWithFrameSize;
  isDAO: boolean;
  style?: StyleProp<ViewStyle>;
}> = ({ networkId, image, isDAO, size = "M", style }) => {
  const network = getNetwork(networkId);
  const sizedStyles = useMemo(
    () => StyleSheet.flatten(flatStyles[size]),
    [size]
  );
  return (
    <View style={[containerStyle, style]}>
      <SVG
        source={emptyCircleFrameSVG}
        width={sizedStyles.frame.width}
        height={sizedStyles.frame.height}
      />

      <AnimationFadeIn style={absoluteStyle}>
        <OptimizedImage
          width={sizedStyles.image.width}
          height={sizedStyles.image.height}
          sourceURI={image}
          fallbackURI={
            [NetworkKind.Cosmos, NetworkKind.Gno].includes(
              network?.kind || NetworkKind.Unknown
            )
              ? (network as CosmosNetworkInfo | GnoNetworkInfo)
                  .nameServiceDefaultImage
              : undefined
          }
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
    </View>
  );
};

const containerStyle: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
};
const absoluteStyle: ViewStyle = {
  position: "absolute",
  zIndex: 2,
};

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

import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import emptyCircleFrameSVG from "../../../assets/empty-circle-frame.svg";
import { useIsDAO } from "../../hooks/cosmwasm/useCosmWasmContractInfo";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { getNetwork, parseUserId } from "../../networks";
import { primaryColor } from "../../utils/style/colors";
import { nameServiceDefaultImage } from "../../utils/tns";
import { OptimizedImage } from "../OptimizedImage";
import { SVG } from "../SVG";
import { AnimationFadeIn } from "../animations/AnimationFadeIn";

type AvatarWithFrameSize = "XL" | "L" | "M" | "S" | "XS" | "XXS";

const frameToAvatarRatio = 0.7;

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
  const frameSize = getSize(size);
  const imageSize = frameSize * frameToAvatarRatio;
  return (
    <View
      style={[
        {
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <SVG
        source={emptyCircleFrameSVG}
        width={frameSize}
        height={frameSize}
        style={{ position: "relative", left: "-0.65%", top: "0.4%" }} // we need this adjustments to properly center the frame around the avatar, FIXME: this should be done in the avatar image
      />

      <AnimationFadeIn
        style={{
          position: "absolute",
          zIndex: 2,
        }}
      >
        <OptimizedImage
          width={imageSize}
          height={imageSize}
          sourceURI={image}
          fallbackURI={nameServiceDefaultImage(isDAO, network)}
          style={[
            { width: imageSize, height: imageSize, backgroundColor: "black" },
            isDAO
              ? {
                  borderRadius: imageSize * 0.05,
                  borderWidth: imageSize * 0.02,
                  borderColor: primaryColor,
                }
              : { borderRadius: imageSize * 0.5 },
          ]}
        />
      </AnimationFadeIn>
    </View>
  );
};

const getSize = (size: AvatarWithFrameSize) => {
  switch (size) {
    case "XL":
      return 196;
    case "L":
      return 92;
    case "M":
      return 68;
    case "S":
      return 48;
    case "XS":
      return 38;
    case "XXS":
      return 32;
  }
};

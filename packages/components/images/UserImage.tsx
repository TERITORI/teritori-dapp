import React from "react";
import { Image, StyleProp, View, ViewStyle } from "react-native";

import userImageFrameSVG from "../../../assets/user-image-frame.svg";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { SVG } from "../SVG";

export const UserImage: React.FC<{
  image: string | null | undefined;
  style?: StyleProp<ViewStyle>;
}> = ({ image, style, children }) => {
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
            top: 32,
            left: 32,
            zIndex: 2,
            marginBottom: 20,
            position: "absolute",
            borderRadius: 24,
          },
          {
            width: 132,
            aspectRatio: 1,
          },
        ]}
      />
      <SVG source={userImageFrameSVG} width={200} height={200} />
      {children}
    </View>
  );
};

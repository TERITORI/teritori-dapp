import React from "react";
import { Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native";

import dorgSVG from "../../../../assets/icons/dorg-icon.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { ipfsURLToHTTPURL } from "../../../utils/ipfs";
import { neutral22, neutral33, neutralA3 } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

interface ImagePreviewerProps {
  uri?: string;
  onError?: () => void;
}

export const ImagePreviewer: React.FC<ImagePreviewerProps> = ({
  uri,
  onError,
}) => {
  return (
    <View>
      <View style={imagePreviewerStyle}>
        {uri ? (
          <Image
            source={{ uri: ipfsURLToHTTPURL(uri) }}
            style={imageStyle}
            onError={onError}
          />
        ) : (
          <SVG
            source={dorgSVG}
            height={imageStyle.height}
            width={imageStyle.width}
          />
        )}
      </View>

      <BrandText style={textStyle}>Preview</BrandText>
    </View>
  );
};

const imagePreviewerStyle: ViewStyle = {
  height: 140,
  width: 140,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: neutral33,
  backgroundColor: neutral22,
  justifyContent: "center",
  alignItems: "center",
  marginBottom: layout.padding_x1_5,
  overflow: "hidden",
};
const imageStyle: ImageStyle = {
  height: 140,
  width: 140,
  borderRadius: 12,
};
const textStyle: TextStyle = {
  ...fontSemibold14,
  color: neutralA3,
  textAlign: "center",
};

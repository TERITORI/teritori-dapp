import React, { FC } from "react";
import { TextStyle, TouchableOpacity, ViewStyle } from "react-native";

import Upload from "../../../../assets/icons/upload_alt.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { SpacerRow } from "../../../components/spacer";
import { neutral30, primaryColor } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export const UploadMusicButton: FC<{ onPress: () => void }> = ({ onPress }) => {
  return (
    <>
      <TouchableOpacity style={buttonContainerStyle} onPress={onPress}>
        <SVG
          source={Upload}
          width={layout.spacing_x2}
          height={layout.spacing_x2}
        />
        <SpacerRow size={1} />
        <BrandText style={buttonTextStyle}>Upload your music</BrandText>
      </TouchableOpacity>
    </>
  );
};

const buttonContainerStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  paddingLeft: layout.spacing_x1,
  paddingRight: layout.spacing_x1_5,
  paddingVertical: layout.spacing_x1,
  backgroundColor: neutral30,
  borderRadius: layout.spacing_x4,
};
const buttonTextStyle: TextStyle = {
  ...fontSemibold14,

  color: primaryColor,
};

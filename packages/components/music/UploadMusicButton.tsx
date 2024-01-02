import React, { FC } from "react";
import { TextStyle, TouchableOpacity, ViewStyle } from "react-native";

import Upload from "../../../assets/icons/upload_alt.svg";
import { neutral30, primaryColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { SpacerRow } from "../spacer";

export const UploadMusicButton: FC<{
  onPress: () => void;
  disabled?: boolean;
}> = ({ onPress, disabled }) => {
  return (
    <>
      <TouchableOpacity
        style={[buttonContainerStyle, { opacity: disabled ? 0.5 : 1 }]}
        onPress={onPress}
        disabled={disabled}
      >
        <SVG
          source={Upload}
          width={layout.spacing_x2}
          height={layout.spacing_x2}
        />
        <SpacerRow size={1} />
        <BrandText style={buttonTextStyle}>Publish as artist</BrandText>
      </TouchableOpacity>
    </>
  );
};

const buttonContainerStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  height: 32,
  paddingLeft: layout.spacing_x1,
  paddingRight: layout.spacing_x1_5,
  backgroundColor: neutral30,
  borderRadius: 999,
};
const buttonTextStyle: TextStyle = {
  ...fontSemibold14,

  color: primaryColor,
};

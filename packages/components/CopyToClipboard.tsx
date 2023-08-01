import Clipboard from "@react-native-clipboard/clipboard";
import React from "react";
import { TouchableOpacity, ViewStyle } from "react-native";

import { BrandText } from "./BrandText";
import { SVG } from "./SVG";
import { TertiaryBox } from "./boxes/TertiaryBox";
import copySVG from "../../assets/icons/copy.svg";
import { useFeedbacks } from "../context/FeedbacksProvider";
import { neutral22 } from "../utils/style/colors";

export const useCopyToClipboard = () => {
  const { setToastSuccess } = useFeedbacks();

  const copyToClipboard = (text: string, successText?: string) => {
    Clipboard.setString(text);
    setToastSuccess({
      title: successText || "Copied",
      message: "",
    });
  };

  return { copyToClipboard };
};

interface CopyToClipboardProps {
  text: string;
  squaresBackgroundColor?: string;
  fullWidth?: boolean;
  containerStyle?: ViewStyle;
}

export const CopyToClipboard = ({
  text,
  squaresBackgroundColor,
  fullWidth,
  containerStyle,
}: CopyToClipboardProps) => {
  const { copyToClipboard } = useCopyToClipboard();

  return (
    <TouchableOpacity
      onPress={() => copyToClipboard(text)}
      style={containerStyle}
    >
      <TertiaryBox
        height={40}
        width={fullWidth ? undefined : 332}
        fullWidth={fullWidth}
        mainContainerStyle={{
          justifyContent: "space-between",
          flexDirection: "row",
          backgroundColor: neutral22,
        }}
        squaresBackgroundColor={squaresBackgroundColor}
      >
        <BrandText
          style={{ fontSize: 14, fontWeight: "500", marginLeft: 12 }}
          numberOfLines={1}
        >
          {text}
        </BrandText>
        <SVG
          width={24}
          height={24}
          source={copySVG}
          style={{ marginRight: 12, marginLeft: 8 }}
        />
      </TertiaryBox>
    </TouchableOpacity>
  );
};

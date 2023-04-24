import * as Clipboard from "expo-clipboard";
import React from "react";
import { TouchableOpacity } from "react-native";

import { SVG } from "./SVG";
import { TertiaryBox } from "./boxes/TertiaryBox";
import copySVG from "../../assets/icons/copy.svg";
import { useFeedbacks } from "../context/FeedbacksProvider";
import { neutral22 } from "../utils/style/colors";

export const CopyToClipboardIcon: React.FC<{
  text: string;
  squaresBackgroundColor?: string;
  size?: number;
}> = ({ text, squaresBackgroundColor, size = 30 }) => {
  const { setToastSuccess } = useFeedbacks();

  const iconSize = size - 10;

  const copyToClipboard = () => {
    setToastSuccess({
      title: "Copied",
      message: "",
    });
    Clipboard.setString(text);
  };

  return (
    <TouchableOpacity onPress={copyToClipboard}>
      <TertiaryBox
        height={size}
        width={size}
        mainContainerStyle={{
          backgroundColor: neutral22,
        }}
        style={{ justifyContent: "space-between", alignItems: "center" }}
        squaresBackgroundColor={squaresBackgroundColor}
      >
        <SVG width={iconSize} height={iconSize} source={copySVG} />
      </TertiaryBox>
    </TouchableOpacity>
  );
};

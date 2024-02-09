import React from "react";
import { TouchableOpacity } from "react-native";

import { SVG } from "./SVG";
import { LegacyTertiaryBox } from "./boxes/LegacyTertiaryBox";
import copySVG from "../../assets/icons/copy.svg";
import { useFeedbacks } from "../context/FeedbacksProvider";
import { neutral22 } from "../utils/style/colors";

import Clipboard from "@/modules/Clipboard";

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
    Clipboard.setStringAsync(text);
  };

  return (
    <TouchableOpacity onPress={copyToClipboard}>
      <LegacyTertiaryBox
        height={size}
        width={size}
        mainContainerStyle={{
          backgroundColor: neutral22,
        }}
        style={{ justifyContent: "space-between", alignItems: "center" }}
        squaresBackgroundColor={squaresBackgroundColor}
      >
        <SVG width={iconSize} height={iconSize} source={copySVG} />
      </LegacyTertiaryBox>
    </TouchableOpacity>
  );
};

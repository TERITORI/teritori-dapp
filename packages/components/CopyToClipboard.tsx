import Clipboard from "@react-native-clipboard/clipboard";
import React from "react";
import { TouchableOpacity } from "react-native";

import { BrandText } from "./BrandText";
import { SVG } from "./SVG";
import { TertiaryBox } from "./boxes/TertiaryBox";
import { CustomPressable } from "./buttons/CustomPressable";
import copySVG from "../../assets/icons/copy.svg";
import { useFeedbacks } from "../context/FeedbacksProvider";
import { neutral22 } from "../utils/style/colors";

export const useCopyToClipboard = () => {
  const { setToastSuccess } = useFeedbacks();

  const copyToClipboard = (text: string, successText?: string) => {
    setToastSuccess({
      title: successText || "Copied",
      message: "",
    });
    Clipboard.setString(text);
  };

  return { copyToClipboard };
};

export const CopyToClipboard: React.FC<{
  text: string;
  squaresBackgroundColor?: string;
  children?: JSX.Element;
}> = ({ text, squaresBackgroundColor, children }) => {
  const { copyToClipboard } = useCopyToClipboard();

  if (children)
    return (
      <CustomPressable
        onPress={() => {
          copyToClipboard(text);
        }}
      >
        {children}
      </CustomPressable>
    );
  return (
    <TouchableOpacity onPress={() => copyToClipboard(text)}>
      <TertiaryBox
        height={40}
        width={332}
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

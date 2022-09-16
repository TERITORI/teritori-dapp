import Clipboard from "@react-native-clipboard/clipboard";
import React from "react";
import { TouchableOpacity } from "react-native";

import copySVG from "../../assets/icons/copy.svg";
import { useFeedbacks } from "../context/FeedbacksProvider";
import { neutral22 } from "../utils/style/colors";
import { BrandText } from "./BrandText";
import { SVG } from "./SVG";
import { TertiaryBox } from "./boxes/TertiaryBox";

export const CopyToClipboard: React.FC<{
  text: string;
}> = ({ text }) => {
  const { setToastSuccess } = useFeedbacks();

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
        height={40}
        width={332}
        mainContainerStyle={{
          justifyContent: "space-between",
          flexDirection: "row",
          backgroundColor: neutral22,
        }}
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

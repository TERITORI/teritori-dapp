import Clipboard from "@react-native-clipboard/clipboard";
import React from "react";
import { TouchableOpacity } from "react-native";
import { SvgProps } from "react-native-svg";

import copySVG from "../../assets/icons/copy.svg";
import { useFeedbacks } from "../context/FeedbacksProvider";
import { fontMedium14 } from "../utils/style/fonts";
import { layout } from "../utils/style/layout";
import { BrandText } from "./BrandText";
import { SVG } from "./SVG";
import { TertiaryBox } from "./boxes/TertiaryBox";

export const CopyToClipboardSecondary: React.FC<{
  text: string;
  iconSVG?: React.FC<SvgProps>;
}> = ({ text, iconSVG }) => {
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
        width={216}
        mainContainerStyle={{
          paddingHorizontal: layout.padding_x1_5,
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        {iconSVG && <SVG width={16} height={16} source={iconSVG} />}
        <BrandText
          style={[
            fontMedium14,
            { width: "100%", marginHorizontal: layout.padding_x1_5 },
          ]}
          numberOfLines={1}
        >
          {text}
        </BrandText>
        <SVG width={16} height={16} source={copySVG} />
      </TertiaryBox>
    </TouchableOpacity>
  );
};

import Clipboard from "@react-native-clipboard/clipboard";
import React from "react";
import { TouchableOpacity } from "react-native";
import { SvgProps } from "react-native-svg";

import copySVG from "../../assets/icons/copy.svg";
import { useFeedbacks } from "../context/FeedbacksProvider";
import { fontMedium14 } from "../utils/style/fonts";
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
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        {iconSVG && (
          <SVG
            width={16}
            height={16}
            source={iconSVG}
            style={{ marginHorizontal: 12 }}
          />
        )}
        <BrandText style={fontMedium14} numberOfLines={1}>
          {text}
        </BrandText>
        <SVG
          width={16}
          height={16}
          source={copySVG}
          style={{ marginHorizontal: 12 }}
        />
      </TertiaryBox>
    </TouchableOpacity>
  );
};

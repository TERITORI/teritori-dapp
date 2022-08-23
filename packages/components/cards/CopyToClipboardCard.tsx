import Clipboard from "@react-native-clipboard/clipboard";
import React from "react";
import { View, TouchableOpacity } from "react-native";

import copySVG from "../../../assets/icons/copy.svg";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { neutral22, neutral33 } from "../../utils/style/colors";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";

export const CopyToClipboardCard: React.FC<{
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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          maxWidth: 332,
          height: 40,
          maxHeight: 40,
          minHeight: 40,
          backgroundColor: neutral22,
          borderWidth: 1,
          borderColor: neutral33,
          borderRadius: 8,
        }}
      >
        <BrandText
          style={{ fontSize: 14, fontWeight: "500", marginLeft: 12 }}
          numberOfLines={1}
        >
          {text}
        </BrandText>
        <SVG width={24} height={24} source={copySVG} style={{marginHorizontal: 12}}/>
      </View>
    </TouchableOpacity>
  );
};

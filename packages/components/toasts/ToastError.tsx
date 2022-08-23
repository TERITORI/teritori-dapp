import React from "react";
import { TouchableOpacity, View, Dimensions } from "react-native";

import warningSVG from "../../../assets/icons/warning.svg";
import { errorColor, neutral11, neutral77 } from "../../utils/style/colors";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";

export const ToastError: React.FC<{
  title: string;
  message?: string;
  onPress: () => void;
}> = ({ title, message, onPress }) => {
  const width = 432;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: neutral11,
        borderColor: errorColor,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: "solid",
        maxWidth: width,
        width,
        height: "auto",
        position: "absolute",
        top: 24,
        left: Dimensions.get("window").width / 2 - width / 2,
        zIndex: 999,
      }}
    >
      <SVG
        width={24}
        height={24}
        source={warningSVG}
        style={{ marginHorizontal: 24 }}
      />

      <View style={{ maxWidth: 287, marginVertical: 12 }}>
        <BrandText style={{ fontSize: 13, lineHeight: 20 }}>{title}</BrandText>
        <BrandText style={{ fontSize: 13, lineHeight: 15, color: neutral77 }}>
          {message}
        </BrandText>
      </View>
    </TouchableOpacity>
  );
};

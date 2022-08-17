import React from "react";
import { Image, TouchableOpacity, View, Dimensions } from "react-native";

import warningPNG from "../../../assets/icons/warning.png";
import { errorColor, neutral11, neutral77 } from "../../utils/style/colors";
import { BrandText } from "../BrandText";

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
        flex: 1,
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
      <Image
        source={warningPNG}
        style={{ width: 24, height: 24, marginHorizontal: 24 }}
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

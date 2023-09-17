import React from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { neutral11, neutral77, successColor } from "../../utils/style/colors";
import { BrandText } from "../BrandText";

export const ToastSuccess: React.FC<{
  title: string;
  message?: string;
  onPress: () => void;
}> = ({ title, message, onPress }) => {
  const width = 300;
  const marginHorizontal = 24;
  const insets = useSafeAreaInsets();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: neutral11,
        borderColor: successColor,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: "solid",
        width,
        maxWidth: width,
        height: "auto",
        position: "absolute",
        top: insets.top + 24,
        left: Dimensions.get("window").width / 2 - width / 2,
        zIndex: 99999999,
      }}
    >
      <View
        style={{
          width: width - marginHorizontal * 2,
          marginVertical: 12,
          marginHorizontal,
        }}
      >
        <BrandText style={{ fontSize: 13, lineHeight: 20, width: "100%" }}>
          {title}
        </BrandText>
        {message ? (
          <BrandText
            style={{
              fontSize: 13,
              lineHeight: 15,
              color: neutral77,
              width: "100%",
            }}
          >
            {message}
          </BrandText>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

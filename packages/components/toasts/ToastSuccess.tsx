import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

import warningPNG from "../../../assets/icons/warning.png";
import {
  errorColor,
  neutral11,
  neutral77,
  successColor,
} from "../../utils/colors";
import { BrandText } from "../BrandText";

export const ToastSuccess: React.FC<{
  title: string;
  message?: string;
  onPress: () => void;
}> = ({ title, message, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: neutral11,
        borderColor: successColor,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: "solid",
        width: "100%",
        maxWidth: 300,
        height: "auto",
        position: "absolute",
        top: 24,
        left: `calc(50% - 300px / 2)`,
        zIndex: 999,
      }}
    >
      <View
        style={{
          width: `calc(100% - 24px * 2)`,
          marginVertical: 12,
          marginHorizontal: 24,
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

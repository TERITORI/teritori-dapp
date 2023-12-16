import React from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";

import { neutral11, neutral77, successColor } from "../../utils/style/colors";
import { BrandText } from "../BrandText";
import { Box } from "../boxes/Box";

export const ToastSuccess: React.FC<{
  title: string;
  message?: string;
  onPress: () => void;
}> = ({ title, message, onPress }) => {
  const width = 300;
  const marginHorizontal = 24;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width,
        maxWidth: width,
        height: "auto",
        position: "absolute",
        top: 24,
        left: Dimensions.get("window").width / 2 - width / 2,
        zIndex: 999,
      }}
    >
      <Box
        notched
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: neutral11,
          borderColor: successColor,
          borderWidth: 1,
          width: "100%",
          height: "100%",
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
      </Box>
    </TouchableOpacity>
  );
};

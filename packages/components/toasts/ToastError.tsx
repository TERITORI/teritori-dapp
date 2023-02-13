import React, { useEffect } from "react";
import {
  TouchableOpacity,
  View,
  Dimensions,
  StyleProp,
  ViewStyle,
  Modal,
} from "react-native";

import warningSVG from "../../../assets/icons/warning.svg";
import { errorColor, neutral11, neutral77 } from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import { toastErrorWidth } from "../../utils/style/toasts";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { SpacerRow } from "../spacer";

export const ToastError: React.FC<{
  title: string;
  onPress: () => void;
  message?: string;
  style?: StyleProp<ViewStyle>;
}> = ({ title, onPress, message, style }) => {
  useEffect(() => {
    const interval = setInterval(() => {
      onPress();
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <Modal
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      animationType="fade"
      transparent
      visible
    >
      <TouchableOpacity
        onPress={onPress}
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: neutral11,
            borderColor: errorColor,
            borderRadius: 8,
            borderWidth: 1,
            borderStyle: "solid",
            maxWidth: toastErrorWidth,
            width: toastErrorWidth,
            height: "auto",
            position: "absolute",
            top: layout.padding_x3,
            left: Dimensions.get("window").width / 2 - toastErrorWidth / 2,
            zIndex: 999,
          },
          style,
        ]}
      >
        <SpacerRow size={3} />
        <SVG width={24} height={24} source={warningSVG} />
        <SpacerRow size={3} />
        <View style={{ maxWidth: 287, marginVertical: 12 }}>
          <BrandText style={{ fontSize: 13, lineHeight: 20 }}>
            {title}
          </BrandText>
          <BrandText style={{ fontSize: 13, lineHeight: 15, color: neutral77 }}>
            {message}
          </BrandText>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

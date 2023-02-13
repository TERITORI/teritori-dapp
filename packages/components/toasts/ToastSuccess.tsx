import React, { useEffect } from "react";
import {
  Dimensions,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
  Modal
} from "react-native";

import { neutral11, neutral77, successColor } from "../../utils/style/colors";
import { toastSuccessWidth } from "../../utils/style/toasts";
import { BrandText } from "../BrandText";

export const ToastSuccess: React.FC<{
  title: string;
  onPress: () => void;
  message?: string;
  style?: StyleProp<ViewStyle>;
}> = ({ title, onPress, message, style }) => {
  const marginHorizontal = 24;

  useEffect(()=>{
    const interval = setInterval(()=>{
      onPress()
    },3000);
    return ()=>{
      clearInterval(interval);
    }
  },[])
  return (
    <Modal
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      animationType="fade"
      transparent
      visible={true}
    >
      <TouchableOpacity
        onPress={onPress}
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: neutral11,
            borderColor: successColor,
            borderRadius: 8,
            borderWidth: 1,
            borderStyle: "solid",
            width: toastSuccessWidth,
            maxWidth: toastSuccessWidth,
            height: "auto",
            position: "absolute",
            top: Dimensions.get("window").height/2,
            left: Dimensions.get("window").width / 2 - toastSuccessWidth / 2,
          },
          style,
        ]}
      >
        <View
          style={{
            width: toastSuccessWidth - marginHorizontal * 2,
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
    </Modal>
  );
};

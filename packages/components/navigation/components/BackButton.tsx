import React from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";

import backSVG from "../../../../assets/icons/back.svg";
import chevronLeftSVG from "../../../../assets/icons/chevron-left.svg";
import { useAppNavigation } from "../../../utils/navigation";
import { neutral22 } from "../../../utils/style/colors";
import { SVG } from "../../SVG";

export const BackButton: React.FC<{
  type?: "arrow" | "chevron";
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}> = ({ onPress, style, type = "arrow" }) => {
  const navigation = useAppNavigation();

  const handleOnPress = () => {
    if (onPress) onPress();
    else if (navigation.canGoBack()) navigation.goBack();
  };

  return (
    <TouchableOpacity onPress={handleOnPress} style={style}>
      {type === "arrow" ? (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: 32,
            height: 32,
            backgroundColor: neutral22,
            borderRadius: 999,
          }}
        >
          <SVG width={24} height={24} source={backSVG} />
        </View>
      ) : (
        <SVG source={chevronLeftSVG} height={28} width={28} />
      )}
    </TouchableOpacity>
  );
};

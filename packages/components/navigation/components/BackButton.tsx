import React from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";

import backSVG from "../../../../assets/icons/back.svg";
import { useAppNavigation } from "../../../utils/navigation";
import { neutral22 } from "../../../utils/style/colors";
import { SVG } from "../../SVG";

export const BackButton: React.FC<{
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}> = ({ onPress, style }) => {
  const navigation = useAppNavigation();

  const handleOnPress = () => {
    if (onPress) onPress();
    else if (navigation.canGoBack()) navigation.goBack();
  };

  return (
    <TouchableOpacity onPress={handleOnPress} style={style}>
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
    </TouchableOpacity>
  );
};

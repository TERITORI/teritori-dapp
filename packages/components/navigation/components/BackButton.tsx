import React from "react";
import { TouchableOpacity, View } from "react-native";

import backSVG from "../../../../assets/icons/back.svg";
import { useTheme } from "../../../hooks/useTheme";
import { useAppNavigation } from "../../../utils/navigation";
import { SVG } from "../../SVG";

export const BackButton: React.FC<{
  onPress?: () => void;
}> = ({ onPress }) => {
  const navigation = useAppNavigation();
  const theme = useTheme();

  const handleOnPress = () => {
    if (onPress) onPress();
    else if (navigation.canGoBack()) navigation.goBack();
  };

  return (
    <TouchableOpacity onPress={handleOnPress}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: 32,
          height: 32,
          backgroundColor: theme.backButtonColor,
          borderRadius: 999,
        }}
      >
        <SVG width={24} height={24} source={backSVG} color={theme.textColor} />
      </View>
    </TouchableOpacity>
  );
};

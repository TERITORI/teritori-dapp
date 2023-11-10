import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

import backSVG from "../../../../assets/icons/back.svg";
import { selectIsLightTheme } from "../../../store/slices/settings";
import { useAppNavigation } from "../../../utils/navigation";
import { neutral22 } from "../../../utils/style/colors";
import { SVG } from "../../SVG";

export const BackButton: React.FC<{
  onPress?: () => void;
}> = ({ onPress }) => {
  const navigation = useAppNavigation();
  const isLightTheme = useSelector(selectIsLightTheme);

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
          backgroundColor: isLightTheme ? "#E5E5E8" : neutral22,
          borderRadius: 999,
        }}
      >
        <SVG
          width={24}
          height={24}
          source={backSVG}
          color={isLightTheme ? "#000" : "#FFF"}
        />
      </View>
    </TouchableOpacity>
  );
};

// A clickable "<- Back To xxx" or "<- Back". Choose if navigate() or goBack(). You can handle more action with onPress() prop
import React from "react";
import { TouchableOpacity, View } from "react-native";

import backSVG from "../../../assets/icons/back.svg";
import { useAppNavigation } from "../../utils/navigation";
import { neutral22 } from "../../utils/style/colors";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { SpacerRow } from "../spacer";

export const BackTo: React.FC<{
  label?: string;
  onPress?: () => void;
}> = ({ label = "", onPress }) => {
  const navigation = useAppNavigation();

  const handleOnPress = () => {
    if (onPress) onPress();
    else if (navigation.canGoBack()) navigation.goBack();
  };

  return (
    <TouchableOpacity onPress={handleOnPress}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {navigation.canGoBack() && (
          <View
            style={{
              width: 32,
              height: 32,
              backgroundColor: neutral22,
              borderRadius: 999,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <SVG width={24} height={24} source={backSVG} />
          </View>
        )}
        <SpacerRow size={1.5} />
        <BrandText>{label}</BrandText>
      </View>
    </TouchableOpacity>
  );
};

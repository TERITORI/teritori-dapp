import React from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";

import chevronLeft from "../../../../../assets/icons/chevron-left.svg";
import close from "../../../../../assets/icons/close.svg";
import { neutralA3, secondaryColor } from "../../../../utils/style/colors";
import { fontMedium16, fontSemibold16 } from "../../../../utils/style/fonts";
import { BrandText } from "../../../BrandText";
import { SVG } from "../../../SVG";
import { SpacerRow } from "../../../spacer";

interface TMapHeaderProps {
  onClose: () => void;
}

export const MapHeader: React.FC<TMapHeaderProps> = ({ onClose }) => {
  return (
    <View style={[header]}>
      <View style={[headerText]}>
        <TouchableOpacity style={[button32]} onPress={onClose}>
          <SVG
            source={chevronLeft}
            height={24}
            width={24}
            color={secondaryColor}
          />
        </TouchableOpacity>
        <BrandText style={[fontSemibold16]}>Add location</BrandText>
        <SpacerRow size={2} />
        <BrandText style={[fontMedium16, { color: neutralA3 }]}>2/2</BrandText>
      </View>

      <TouchableOpacity style={[button32]} onPress={onClose}>
        <SVG source={close} height={24} width={24} color={secondaryColor} />
      </TouchableOpacity>
    </View>
  );
};

// MapHeader styles
const header: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  paddingVertical: 20,
};

const headerText: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
};

const button32: ViewStyle = {
  height: 32,
  width: 32,
  alignItems: "center",
  justifyContent: "center",
};

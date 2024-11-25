import React from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";

import { secondaryColor } from "../../../../utils/style/colors";
import { fontSemibold16 } from "../../../../utils/style/fonts";
import { BrandText } from "../../../BrandText";
import { SVG } from "../../../SVG";

import close from "@/assets/icons/close.svg";

interface TMapHeaderProps {
  onClose: () => void;
}

export const MapModalHeader: React.FC<TMapHeaderProps> = ({ onClose }) => {
  return (
    <View style={[header]}>
      <View style={[headerText]}>
        <BrandText style={[fontSemibold16]}>
          Add a Location to this post
        </BrandText>
      </View>

      <TouchableOpacity style={[button32]} onPress={onClose}>
        <SVG source={close} height={24} width={24} color={secondaryColor} />
      </TouchableOpacity>
    </View>
  );
};

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

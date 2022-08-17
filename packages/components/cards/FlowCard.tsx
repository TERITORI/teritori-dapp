import React from "react";
import {
  ViewStyle,
  View,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";

import flowCardPNG from "../../../assets/cards/name-card.png";
import { BrandText } from "../BrandText";

export const FlowCard: React.FC<{
  label: string;
  description: string;
  iconSource: ImageSourcePropType;
  style?: ViewStyle;
  onPress: () => void;
  disabled?: boolean;
}> = ({ label, description, iconSource, style, disabled, onPress }) => {
  const width = 392;
  const height = 100;

  return (
    <TouchableOpacity
      style={[disabled && { opacity: 0.5 }, style]}
      onPress={onPress}
      disabled={disabled}
    >
      <Image
        source={flowCardPNG}
        style={{ width, height, position: "absolute", resizeMode: "stretch" }}
      />

      <View
        style={{
          flex: 1,
          flexDirection: "row",
          padding: 20,
          width,
          height,
          minWidth: width,
          minHeight: height,
        }}
      >
        <Image
          source={iconSource}
          style={{
            width: 24,
            height: 24,
            resizeMode: "stretch",
            marginRight: 8,
          }}
        />

        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <BrandText>{label}</BrandText>
          <BrandText
            style={{
              color: "#A3A3A3",
              fontSize: 14,
            }}
          >
            {description}
          </BrandText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

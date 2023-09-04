import Slider from "@react-native-community/slider";
import React from "react";
import { TextInput, View } from "react-native";

import { BrandText } from "./BrandText";
import {
  neutral33,
  neutral44,
  neutralA3,
  primaryColor,
  secondaryColor,
} from "../utils/style/colors";
import { fontSemibold14 } from "../utils/style/fonts";
import { layout } from "../utils/style/layout";

interface RangeSliderProps {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
  label,
  value,
  onValueChange,
}) => {
  return (
    <View>
      <BrandText style={[fontSemibold14, { color: neutralA3 }]}>
        {label}
      </BrandText>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            width: 464,
          }}
        >
          <Slider
            value={value}
            onValueChange={(val: number) => onValueChange(Math.round(val))}
            thumbTintColor={secondaryColor}
            maximumValue={100}
            minimumTrackTintColor={primaryColor}
            maximumTrackTintColor={neutral44}
          />
        </View>
        <TextInput
          value={`${value} %`}
          style={[
            fontSemibold14,
            {
              color: secondaryColor,
              borderWidth: 1,
              padding: layout.spacing_x2,
              marginLeft: layout.spacing_x2,
              borderColor: neutral33,
              borderRadius: 12,
              width: 70,
              justifyContent: "center",
              textAlign: "center",
            },
          ]}
        />
      </View>
    </View>
  );
};

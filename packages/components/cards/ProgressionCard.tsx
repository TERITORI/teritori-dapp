import React from "react";
import { ViewStyle, View, StyleProp } from "react-native";

import { neutral44, neutral77, primaryColor } from "../../utils/style/colors";
import { fontSemibold12, fontSemibold28 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { GradientText } from "../gradientText";

export const ProgressionCard: React.FC<{
  style?: StyleProp<ViewStyle>;
  label: string;
  valueCurrent: number;
  valueMax: number;
}> = ({ style, label, valueCurrent, valueMax }) => {
  const percent = Math.round((valueCurrent * 100) / valueMax);

  return (
    <TertiaryBox
      style={style}
      height={100}
      fullWidth
      mainContainerStyle={{
        paddingHorizontal: 16,
        paddingVertical: 16,
        width: "100%",
      }}
    >
      <View style={{ zIndex: 2, width: "100%" }}>
        <BrandText style={[fontSemibold12, { marginBottom: 8 }]}>
          {label}
        </BrandText>

        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <GradientText gradientType="blue" style={fontSemibold28}>
            {percent}%
          </GradientText>

          <BrandText
            style={[fontSemibold12, { color: neutral77, marginRight: 6 }]}
          >
            {valueCurrent}/{valueMax}
          </BrandText>
        </View>

        <View
          style={{
            borderRadius: 20,
            height: 4,
            backgroundColor: neutral44,
            width: "100%",
          }}
        >
          <View
            style={{
              borderRadius: 20,
              height: 4,
              backgroundColor: primaryColor,
              width: `${percent}%`,
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
        </View>
      </View>
    </TertiaryBox>
  );
};

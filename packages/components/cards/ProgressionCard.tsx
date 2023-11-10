import React from "react";
import { ViewStyle, View, StyleProp } from "react-native";
import { useSelector } from "react-redux";

import { selectIsLightTheme } from "../../store/slices/settings";
import { neutral44, neutral77, primaryColor } from "../../utils/style/colors";
import { fontSemibold12, fontSemibold28 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { GradientText } from "../gradientText";

type ProgressionBaseProps = {
  label: string;
  valueCurrent: number;
  valueMax: number;
};

const ProgressionBase: React.FC<ProgressionBaseProps> = ({
  label,
  valueCurrent,
  valueMax,
}) => {
  const percent = Math.round((valueCurrent * 100) / valueMax);
  const isLightTheme = useSelector(selectIsLightTheme);
  return (
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
          {valueCurrent.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/
          {valueMax.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </BrandText>
      </View>

      <View
        style={{
          borderRadius: 20,
          height: 4,
          backgroundColor: isLightTheme ? "#ECECEC" : neutral44,
          width: "100%",
        }}
      >
        <View
          style={{
            borderRadius: 20,
            height: 4,
            backgroundColor: isLightTheme ? "#3063D3" : primaryColor,
            width: `${percent}%`,
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
      </View>
    </View>
  );
};

type ProgressionProps = ProgressionBaseProps & {
  style?: StyleProp<ViewStyle>;
};

export const ProgressionCardWithoutBox: React.FC<ProgressionProps> = (
  props
) => {
  return (
    <View style={props.style}>
      <ProgressionBase {...props} />
    </View>
  );
};

export const ProgressionCard: React.FC<ProgressionProps> = (props) => {
  return (
    <TertiaryBox
      style={props.style}
      height={100}
      fullWidth
      mainContainerStyle={{
        paddingHorizontal: 16,
        paddingVertical: 16,
        width: "100%",
      }}
    >
      <ProgressionBase {...props} />
    </TertiaryBox>
  );
};

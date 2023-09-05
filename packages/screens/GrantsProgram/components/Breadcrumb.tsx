import React from "react";
import { StyleProp, ViewStyle } from "react-native";

import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import {
  neutral00,
  neutral17,
  neutral22,
  neutral77,
  neutralFF,
  primaryColor,
} from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

const Step: React.FC<{
  indice: number;
  text: string;
  active?: boolean;
  disabled?: boolean;
}> = ({ indice, text, active, disabled }) => {
  return (
    <FlexRow style={{ width: "auto" }}>
      <BrandText
        style={[
          fontSemibold14,
          {
            color: disabled ? neutral77 : neutral00,
            backgroundColor: active
              ? primaryColor
              : disabled
              ? neutral22
              : neutralFF,
            borderRadius: 100,
            width: 32,
            height: 32,
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            marginRight: layout.spacing_x2,
          },
        ]}
      >
        {indice}
      </BrandText>

      <BrandText
        numberOfLines={1}
        style={[
          fontSemibold14,
          {
            color: active ? primaryColor : disabled ? neutral77 : neutralFF,
          },
        ]}
      >
        {text}
      </BrandText>
    </FlexRow>
  );
};

const Seperator = () => {
  return (
    <BrandText
      style={[
        fontSemibold16,
        { color: neutral77, marginHorizontal: layout.spacing_x2 },
      ]}
    >
      {">"}
    </BrandText>
  );
};

export const Breadcrumb: React.FC<{
  stepIndice?: number;
  containerStyle?: StyleProp<ViewStyle>;
}> = ({ stepIndice = 1, containerStyle }) => {
  return (
    <TertiaryBox
      noBrokenCorners
      fullWidth
      mainContainerStyle={[
        {
          backgroundColor: neutral17,
          borderWidth: 0,
          padding: layout.spacing_x1_5,
        },
        containerStyle,
      ]}
    >
      <FlexRow style={{ width: "auto" }}>
        <Step
          indice={1}
          text="Short presentation"
          active={stepIndice === 1}
          disabled={stepIndice < 1}
        />
        <Seperator />
        <Step
          indice={2}
          text="Team and links"
          active={stepIndice === 2}
          disabled={stepIndice < 2}
        />
        <Seperator />
        <Step
          indice={3}
          text="Milestones"
          active={stepIndice === 3}
          disabled={stepIndice < 3}
        />
        <Seperator />
        <Step
          indice={4}
          text="Preview"
          active={stepIndice === 4}
          disabled={stepIndice < 4}
        />
        <Seperator />
        <Step
          indice={5}
          text="Confirm and Sign"
          active={stepIndice === 5}
          disabled={stepIndice < 5}
        />
      </FlexRow>
    </TertiaryBox>
  );
};

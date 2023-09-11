import React from "react";
import { StyleProp, ViewStyle } from "react-native";

import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { TertiaryBox } from "../../../components/boxes/TertiaryBox";
import { useAppNavigation } from "../../../utils/navigation";
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
  onPress: (step: number) => void;
}> = ({ indice, text, active, disabled, onPress }) => {
  return (
    <FlexRow style={{ width: "auto" }}>
      <BrandText
        onPress={() => onPress(indice)}
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

const STEPS = [
  "Short presentation",
  "Team and links",
  "Milestones",
  "Preview",
  "Confirm and Sign",
];

export const Breadcrumb: React.FC<{
  stepIndice?: number;
  containerStyle?: StyleProp<ViewStyle>;
}> = ({ stepIndice = 1, containerStyle }) => {
  const navigation = useAppNavigation();

  const selectStep = (stepIndice: number) => {
    navigation.navigate("GrantsProgramMakeRequest", { step: 2 });
  };

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
        {STEPS.map((step, idx) => {
          return (
            <>
              <Step
                onPress={selectStep}
                indice={idx + 1}
                text={step}
                active={stepIndice === idx + 1}
                disabled={stepIndice < idx + 1}
              />
              {idx + 1 < STEPS.length && <Seperator />}
            </>
          );
        })}
      </FlexRow>
    </TertiaryBox>
  );
};

import React, { Fragment } from "react";

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
import { useMakeRequestState } from "../hooks/useMakeRequestHook";

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
        onPress={() => onPress(indice)}
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
  "Milestones",
  "Preview",
  "Confirm and Sign",
];

export const Breadcrumb: React.FC<{
  stepIndice?: number;
}> = ({ stepIndice = 1 }) => {
  const {
    stepIndice: currentStepIndice,
    actions: { gotoStep },
  } = useMakeRequestState();

  // We can only goto passed steps
  const gotoValidStep = (targetStepIndice: number) => {
    if (targetStepIndice <= currentStepIndice) {
      gotoStep(targetStepIndice);
    }
  };

  return (
    <TertiaryBox
      style={{
        backgroundColor: neutral17,
        borderWidth: 0,
        padding: layout.spacing_x1_5,
        marginTop: layout.spacing_x2,
      }}
    >
      <FlexRow style={{ width: "auto" }}>
        {STEPS.map((step, idx) => {
          return (
            <Fragment key={idx}>
              <Step
                onPress={gotoValidStep}
                indice={idx + 1}
                text={step}
                active={stepIndice === idx + 1}
                disabled={stepIndice < idx + 1}
              />
              {idx + 1 < STEPS.length && <Seperator />}
            </Fragment>
          );
        })}
      </FlexRow>
    </TertiaryBox>
  );
};

import React, { Fragment } from "react";

import { BrandText } from "./BrandText";
import FlexRow from "./FlexRow";
import { TertiaryBox } from "./boxes/TertiaryBox";
import {
  neutral00,
  neutral17,
  neutral22,
  neutral77,
  neutralFF,
  primaryColor,
} from "../utils/style/colors";
import { fontSemibold14, fontSemibold16 } from "../utils/style/fonts";
import { layout } from "../utils/style/layout";

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

export const Breadcrumb: React.FC<{
  currentStepIndice?: number;
  gotoStep: (stepIndex: number) => void;
  steps: string[];
}> = ({ currentStepIndice = 1, gotoStep, steps }) => {
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
        {steps.map((step, idx) => {
          return (
            <Fragment key={idx}>
              <Step
                onPress={gotoValidStep}
                indice={idx + 1}
                text={step}
                active={currentStepIndice === idx + 1}
                disabled={currentStepIndice < idx + 1}
              />
              {idx + 1 < steps.length && <Seperator />}
            </Fragment>
          );
        })}
      </FlexRow>
    </TertiaryBox>
  );
};

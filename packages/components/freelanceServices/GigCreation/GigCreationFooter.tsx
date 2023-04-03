import React from "react";
import { View } from "react-native";

import { neutral33 } from "../../../utils/style/colors";
import { GigStep } from "../../../utils/types/freelance";
import { PrimaryButton } from "../../buttons/PrimaryButton";

type GigCreationFooterProps = {
  step: GigStep;
  nextStep: () => void;
};

export const GigCreationFooter: React.FC<GigCreationFooterProps> = ({
  step,
  nextStep,
}) => {
  const getButtonText = (): string => {
    if (step < GigStep.Publish) return "Save & Continue";
    else {
      if (step === GigStep.Publish) return "Publish";
      else return "Done";
    }
  };

  return (
    <View style={{ flexDirection: "column" }}>
      <View
        style={{
          height: 1,
          backgroundColor: neutral33,
          marginTop: 24,
          marginBottom: 5,
        }}
      />
      <View style={{ marginTop: 10, alignItems: "flex-end" }}>
        <PrimaryButton
          style={{ marginRight: 20 }}
          size="SM"
          text={getButtonText()}
          onPress={nextStep}
        />
      </View>
    </View>
  );
};

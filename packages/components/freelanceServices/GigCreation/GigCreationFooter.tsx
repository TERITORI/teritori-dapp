import React from "react";
import { View } from "react-native";

import { neutral33 } from "../../../utils/style/colors";
import { PrimaryButton } from "../../buttons/PrimaryButton";

type GigCreationFooterProps = {
  currentStep: number;
  setCurrentStep: any;
};

export const GigCreationFooter: React.FC<GigCreationFooterProps> = ({
  currentStep,
  setCurrentStep,
}) => {
  const getButtonText = (): string => {
    if (currentStep < 5) return "Save & Continue";
    else {
      if (currentStep === 5) return "Publish";
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
          onPress={() => {
            if (currentStep < 6) setCurrentStep(currentStep + 1);
          }}
        />
      </View>
    </View>
  );
};

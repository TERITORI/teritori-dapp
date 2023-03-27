import React, { useState } from "react";
import { View } from "react-native";

import { GigCreationBody } from "../../components/freelanceServices/GigCreation/GigCreationBody";
import { GigCreationFooter } from "../../components/freelanceServices/GigCreation/GigCreationFooter";
import { GigCreationHeader } from "../../components/freelanceServices/GigCreation/GigCreationHeader";
import { ScreenFC } from "../../utils/navigation";
import { FreelanceServicesScreenWrapper } from "./FreelanceServicesScreenWrapper";

export const FreelanceServicesGigCreation: ScreenFC<
  "FreelanceServicesGigCreation"
> = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  return (
    <FreelanceServicesScreenWrapper>
      <View style={{ marginLeft: 35, zIndex: 1 }}>
        <GigCreationHeader
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
        <GigCreationBody currentStep={currentStep} />
      </View>
      <GigCreationFooter
        setCurrentStep={setCurrentStep}
        currentStep={currentStep}
      />
    </FreelanceServicesScreenWrapper>
  );
};

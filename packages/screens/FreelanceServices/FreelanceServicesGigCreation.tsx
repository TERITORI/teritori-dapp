import React, { useState } from "react";
import { View } from "react-native";

import { GigCreationBody } from "../../components/freelanceServices/GigCreation/GigCreationBody";
import { GigCreationFooter } from "../../components/freelanceServices/GigCreation/GigCreationFooter";
import { GigCreationHeader } from "../../components/freelanceServices/GigCreation/GigCreationHeader";
import { ScreenFC } from "../../utils/navigation";
import { FreelanceServicesScreenWrapper } from "./FreelanceServicesScreenWrapper";
import { emptyGigInfo, GigInfo } from "./types/fields";

export const FreelanceServicesGigCreation: ScreenFC<
  "FreelanceServicesGigCreation"
> = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [gigInfo, setGigInfo] = useState<GigInfo>(emptyGigInfo);
  return (
    <FreelanceServicesScreenWrapper>
      <View style={{ marginLeft: 35, zIndex: 1 }}>
        <GigCreationHeader
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
        <GigCreationBody
          step={currentStep}
          gigInfo={gigInfo}
          setGig={setGigInfo}
        />
      </View>
      <GigCreationFooter
        setCurrentStep={setCurrentStep}
        currentStep={currentStep}
      />
    </FreelanceServicesScreenWrapper>
  );
};

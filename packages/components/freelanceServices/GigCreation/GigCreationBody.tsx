import React from "react";
import { View } from "react-native";

import { GigCreationDescription } from "./GigCreationDescription";
import { GigCreationGallery } from "./GigCreationGallery";
import { GigCreationOverview } from "./GigCreationOverview";
import { GigCreationPricing } from "./GigCreationPricing";
import { GigCreationPublish } from "./GigCreationPublish";
import { GigCreationRequirement } from "./GigCreationRequirement";

type GigCreationBodyProps = {
  currentStep: number;
};

export const GigCreationBody: React.FC<GigCreationBodyProps> = ({
  currentStep,
}) => {
  return (
    <View>
      {currentStep === 1 && <GigCreationOverview />}
      {currentStep === 2 && <GigCreationPricing />}
      {currentStep === 3 && <GigCreationDescription />}
      {currentStep === 4 && <GigCreationRequirement />}
      {currentStep === 5 && <GigCreationGallery />}
      {currentStep === 6 && <GigCreationPublish />}
    </View>
  );
};

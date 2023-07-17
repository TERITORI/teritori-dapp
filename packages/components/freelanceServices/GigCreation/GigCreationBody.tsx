import React from "react";
import { View } from "react-native";

import { GigCreationDescription } from "./GigCreationDescription";
import { GigCreationGallery } from "./GigCreationGallery";
import { GigCreationOverview } from "./GigCreationOverview";
import { GigCreationPricing } from "./GigCreationPricing";
import { GigCreationPublish } from "./GigCreationPublish";
import { GigCreationRequirement } from "./GigCreationRequirement";
import { GigInfo } from "../../../screens/FreelanceServices/types/fields";
import { GigStep } from "../../../utils/types/freelance";

type GigCreationBodyProps = {
  step: GigStep;
  gigInfo: GigInfo;
  setGig: React.Dispatch<React.SetStateAction<GigInfo>>;
};

export const GigCreationBody: React.FC<GigCreationBodyProps> = ({
  step,
  gigInfo,
  setGig,
}) => {
  return (
    <View>
      {step === GigStep.OverView && (
        <GigCreationOverview gigInfo={gigInfo} setGig={setGig} />
      )}
      {step === GigStep.Pricing && (
        <GigCreationPricing gigInfo={gigInfo} setGig={setGig} />
      )}
      {step === GigStep.Description && (
        <GigCreationDescription gigInfo={gigInfo} setGig={setGig} />
      )}
      {step === GigStep.Requirement && (
        <GigCreationRequirement gigInfo={gigInfo} setGig={setGig} />
      )}
      {step === GigStep.Gallery && (
        <GigCreationGallery gigInfo={gigInfo} setGig={setGig} />
      )}
      {step === GigStep.Publish && (
        <GigCreationPublish gigInfo={gigInfo} setGig={setGig} />
      )}
    </View>
  );
};

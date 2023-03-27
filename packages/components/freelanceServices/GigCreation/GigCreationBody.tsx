import React from "react";
import { View } from "react-native";

import { GigInfo } from "../../../screens/FreelanceServices/types/fields";
import { GigCreationDescription } from "./GigCreationDescription";
import { GigCreationGallery } from "./GigCreationGallery";
import { GigCreationOverview } from "./GigCreationOverview";
import { GigCreationPricing } from "./GigCreationPricing";
import { GigCreationPublish } from "./GigCreationPublish";
import { GigCreationRequirement } from "./GigCreationRequirement";
type GigCreationBodyProps = {
  step: number;
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
      {step === 1 && <GigCreationOverview gigInfo={gigInfo} setGig={setGig} />}
      {step === 2 && <GigCreationPricing gigInfo={gigInfo} setGig={setGig} />}
      {step === 3 && (
        <GigCreationDescription gigInfo={gigInfo} setGig={setGig} />
      )}
      {step === 4 && (
        <GigCreationRequirement gigInfo={gigInfo} setGig={setGig} />
      )}
      {step === 5 && <GigCreationGallery gigInfo={gigInfo} setGig={setGig} />}
      {step === 6 && <GigCreationPublish gigInfo={gigInfo} setGig={setGig} />}
    </View>
  );
};

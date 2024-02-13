import React from "react";

import { AllSet } from "../../Mini/ConnectLedger/components/AllSet";
import MultiStepScreenContainer from "../../Mini/layout/MultiStepScreenContainer";

import { ScreenFC } from "@/utils/navigation";

export const SuccessScreen: ScreenFC<"SuccessScreen"> = ({ navigation }) => {
  return (
    <MultiStepScreenContainer screenPercentage={100}>
      <AllSet
        onComplete={() => navigation.navigate("MiniTabs")}
        description="Click on the Start button to launch Teritori."
      />
    </MultiStepScreenContainer>
  );
};

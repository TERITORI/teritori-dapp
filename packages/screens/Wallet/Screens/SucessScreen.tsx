import React from "react";

import { ScreenFC } from "../../../utils/navigation";
import { AllSet } from "../../Mini/ConnectLedger/components/AllSet";
import MultiStepScreenContainer from "../../Mini/layout/MultiStepScreenContainer";

export const SuccessScreen: ScreenFC<"SuccessScreen"> = ({ navigation }) => {
  return (
    <MultiStepScreenContainer screenPercentage={100}>
      <AllSet onComplete={() => navigation.navigate("MiniTabs")} />
    </MultiStepScreenContainer>
  );
};

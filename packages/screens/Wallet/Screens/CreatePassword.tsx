import React from "react";

import { CreatePassword as LedgerCreatePassword } from "../../Mini/ConnectLedger/components/CreatePassword";
import MultiStepScreenContainer from "../../Mini/layout/MultiStepScreenContainer";

import { ScreenFC, useAppNavigation } from "@/utils/navigation";

export const CreatePassword: ScreenFC<"CreatePassword"> = () => {
  const { navigate } = useAppNavigation();
  return (
    <MultiStepScreenContainer screenPercentage={50} enableBack>
      <LedgerCreatePassword onStepChange={() => navigate("SuccessScreen")} />
    </MultiStepScreenContainer>
  );
};

import React from "react";

import { ScreenFC, useAppNavigation } from "../../../utils/navigation";
import MultiStepScreenContainer from "../../Mini/layout/MultiStepScreenContainer";

import { CreatePassword as LedgerCreatePassword } from "@/screens/Mini/ConnectLedger/components/CreatePassword";

export const CreatePassword: ScreenFC<"CreatePassword"> = () => {
  const { navigate } = useAppNavigation();
  return (
    <MultiStepScreenContainer screenPercentage={50} enableBack>
      <LedgerCreatePassword onStepChange={() => navigate("SuccessScreen")} />
    </MultiStepScreenContainer>
  );
};

import React, { useState } from "react";
import { View } from "react-native";

import { AllSet } from "./components/AllSet";
import { ConnectDevice } from "./components/ConnectDevice";
import { CreatePassword } from "./components/CreatePassword";
import { LoadingAccounts } from "./components/LoadingAccounts";
import { OpenHelpInApp } from "./components/OpenHelpInApp";
import { RequestingPermission } from "./components/RequestingPermission";
import { SelectAccounts } from "./components/SelectAccounts";
import MultiStepScreenContainer from "../layout/MultiStepScreenContainer";

import { ScreenFC } from "@/utils/navigation";

const screensSteps = {
  step_1: "connect-device",
  step_2: "request-permission",
  step_3: "open-help-app",
  step_4: "loading-accounts",
  step_5: "select-accounts",
  step_6: "create-password",
  step_7: "all-set",
} as const;

export type StepType = keyof typeof screensSteps;

export const ConnectLedgerScreen: ScreenFC<"ConnectLedger"> = ({
  navigation,
}) => {
  const [activeStep, setActiveStep] = useState<StepType>("step_1");
  const activeScreen = screensSteps[activeStep];

  const onStepChange = (step: StepType) => {
    setActiveStep(step);
  };

  const onComplete = () => navigation.navigate("MiniTabs");

  const activeScreenPosition = +activeStep.split("_")[1];
  const screenPercentage =
    (activeScreenPosition / Object.keys(screensSteps).length) * 100;

  return (
    <MultiStepScreenContainer screenPercentage={screenPercentage}>
      <View
        style={{
          flex: 1,
        }}
      >
        {
          {
            "connect-device": <ConnectDevice onStepChange={onStepChange} />,
            "request-permission": (
              <RequestingPermission onStepChange={onStepChange} />
            ),
            "open-help-app": <OpenHelpInApp onStepChange={onStepChange} />,
            "loading-accounts": <LoadingAccounts onStepChange={onStepChange} />,
            "select-accounts": <SelectAccounts onStepChange={onStepChange} />,
            "create-password": <CreatePassword onStepChange={onStepChange} />,
            "all-set": (
              <AllSet
                onComplete={onComplete}
                description="Your Ledger account has been successfully added to Teritori. Now you
            can start exploring the app."
              />
            ),
          }[activeScreen]
        }
      </View>
    </MultiStepScreenContainer>
  );
};

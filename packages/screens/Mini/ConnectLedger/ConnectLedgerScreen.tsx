import React, { useState } from "react";
import { SafeAreaView, View } from "react-native";

import { ConnectDevice } from "./components/ConnectDevice";
import { OpenHelpInApp } from "./components/OpenHelpInApp";
import { RequestingPermission } from "./components/RequestingPermission";
import teritoriSVG from "../../../../assets/icons/teritori-white.svg";
import { SVG } from "../../../components/SVG";
import { ScreenFC } from "../../../utils/navigation";
import { layout } from "../../../utils/style/layout";
import { ProgressLine2 } from "../components/ProgressLine2";

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

export const ConnectLedgerScreen: ScreenFC<"ConnectLedger"> = ({}) => {
  const [activeStep, setActiveStep] = useState<StepType>("step_1");
  const activeScreen = screensSteps[activeStep];

  const onStepChange = (step: StepType) => {
    setActiveStep(step);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        width: "100%",
        backgroundColor: "#000000",
      }}
    >
      <View style={{ marginVertical: layout.spacing_x1_5 }}>
        <SVG
          source={teritoriSVG}
          height={27}
          width={27}
          style={{ alignSelf: "center", marginBottom: layout.spacing_x2_5 }}
        />
        <ProgressLine2 percent={50} />
      </View>
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
            "loading-accounts": <ConnectDevice onStepChange={onStepChange} />,
            "select-accounts": <ConnectDevice onStepChange={onStepChange} />,
            "create-password": <ConnectDevice onStepChange={onStepChange} />,
            "all-set": <ConnectDevice onStepChange={onStepChange} />,
          }[activeScreen]
        }
      </View>
    </SafeAreaView>
  );
};

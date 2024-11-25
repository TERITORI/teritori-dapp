import React from "react";
import { View } from "react-native";

import { ConfirmAndSign } from "./ConfirmAndSign";
import { Milestones } from "./Milestones";
import { Preview } from "./Preview";
import { ShortPresentation } from "./ShortPresentation";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { SpacerColumn } from "../../../components/spacer";
import { NetworkKind } from "../../../networks";
import { ScreenFC } from "../../../utils/navigation";
import { HeaderBackButton } from "../components/HeaderBackButton";
import { useMakeRequestState } from "../hooks/useMakeRequestHook";

import { Breadcrumb } from "@/components/Breadcrumb";

const renderStep = (stepIndice: number) => {
  if (stepIndice === 1) return <ShortPresentation />;
  if (stepIndice === 2) return <Milestones />;
  if (stepIndice === 3) return <Preview />;
  if (stepIndice === 4) return <ConfirmAndSign />;
};

const STEPS = [
  "Short presentation",
  "Milestones",
  "Preview",
  "Confirm and Sign",
];

export const ProjectsMakeRequestScreen: ScreenFC<
  "ProjectsMakeRequest"
> = () => {
  const {
    stepIndice,
    actions: { gotoStep },
  } = useMakeRequestState();

  return (
    <ScreenContainer
      forceNetworkKind={NetworkKind.Gno}
      isLarge
      responsive
      headerChildren={<HeaderBackButton />}
    >
      <Breadcrumb
        currentStepIndice={stepIndice}
        gotoStep={gotoStep}
        steps={STEPS}
      />

      <SpacerColumn size={4} />

      {/* Main view============================================================ */}
      <View style={{ width: "100%" }}>{renderStep(stepIndice)}</View>
    </ScreenContainer>
  );
};

import React from "react";
import { View } from "react-native";

import { ConfirmAndSign } from "./ConfirmAndSign";
import { Milestones } from "./Milestones";
import { Preview } from "./Preview";
import { ShortPresentation } from "./ShortPresentation";
import { TeamAndLinks } from "./TeamAndLinks";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { SpacerColumn } from "../../../components/spacer";
import { NetworkKind } from "../../../networks";
import { ScreenFC } from "../../../utils/navigation";
import { Breadcrumb } from "../components/Breadcrumb";
import { HeaderBackButton } from "../components/HeaderBackButton";
import { useMakeRequestState } from "../hooks/useMakeRequestHook";

const renderStep = (stepIndice: number) => {
  if (stepIndice === 1) return <ShortPresentation />;
  if (stepIndice === 2) return <TeamAndLinks />;
  if (stepIndice === 3) return <Milestones />;
  if (stepIndice === 4) return <Preview />;
  if (stepIndice === 5) return <ConfirmAndSign />;
}

export const ProjectsMakeRequestScreen: ScreenFC<
  "ProjectsMakeRequest"
> = () => {
  const { stepIndice } = useMakeRequestState();

  return (
    <ScreenContainer
      forceNetworkKind={NetworkKind.Gno}
      isLarge
      responsive
      headerChildren={<HeaderBackButton />}
    >
      <Breadcrumb stepIndice={stepIndice} />

      <SpacerColumn size={4} />

      {/* Main view============================================================ */}
      <View style={{ width: "100%" }}>{renderStep(stepIndice)}</View>
    </ScreenContainer>
  );
};

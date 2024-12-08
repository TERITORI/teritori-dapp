import React from "react";
import { View } from "react-native";

import { CreateTokenBasics } from "./LaunchpadERC20CreateTokenBasics";
import { CreateTokenDetails } from "./LaunchpadERC20CreateTokenDetails";
import { CreateTokenSign } from "./LaunchpadERC20CreateTokenSign";
import { useCreateTokenState } from "../hooks/useCreateToken";

import { Breadcrumb } from "@/components/Breadcrumb";
import { ScreenContainer } from "@/components/ScreenContainer";
import { ScreenTitle } from "@/components/ScreenContainer/ScreenTitle";
import { SpacerColumn } from "@/components/spacer";
import { NetworkKind } from "@/networks";
import { ScreenFC, useAppNavigation } from "@/utils/navigation";

const renderStep = (stepIndice: number) => {
  if (stepIndice === 1) return <CreateTokenBasics />;
  if (stepIndice === 2) return <CreateTokenDetails />;
  if (stepIndice === 3) return <CreateTokenSign />;
};

const STEPS = ["Basics Informations", "Details Informations", "Sign & Deploy"];

export const LaunchpadERC20CreateTokenScreen: ScreenFC<
  "LaunchpadERC20CreateToken"
> = () => {
  const {
    stepIndice,
    actions: { gotoStep },
  } = useCreateTokenState();
  const navigation = useAppNavigation();

  return (
    <ScreenContainer
      forceNetworkKind={NetworkKind.Gno}
      isLarge
      responsive
      headerChildren={<ScreenTitle>Launchpad ERC20 Token Creation</ScreenTitle>}
      onBackPress={() => navigation.navigate("LaunchpadERC20Tokens")}
    >
      <Breadcrumb
        currentStepIndice={stepIndice}
        gotoStep={gotoStep}
        steps={STEPS}
      />

      <SpacerColumn size={4} />

      <View style={{ width: "100%" }}>{renderStep(stepIndice)}</View>
    </ScreenContainer>
  );
};

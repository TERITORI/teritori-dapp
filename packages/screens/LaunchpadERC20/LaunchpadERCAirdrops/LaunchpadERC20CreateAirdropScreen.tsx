import React from "react";
import { View } from "react-native";

import { CreateAirdropForm } from "./LaunchpadERC20CreateAirdropForm";
import { CreateAirdropSign } from "./LaunchpadERC20CreateAirdropSign";
import { useCreateAirdropState } from "../hooks/useCreateAirdrop";

import { BrandText } from "@/components/BrandText";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ScreenContainer } from "@/components/ScreenContainer";
import { SpacerColumn } from "@/components/spacer";
import { NetworkKind } from "@/networks";
import { ScreenFC, useAppNavigation } from "@/utils/navigation";
import { fontSemibold20 } from "@/utils/style/fonts";

const renderStep = (stepIndice: number) => {
  if (stepIndice === 1) return <CreateAirdropForm />;
  if (stepIndice === 2) return <CreateAirdropSign />;
};

const STEPS = ["Informations", "Sign & Deploy"];

export const LaunchpadERC20CreateAirdropScreen: ScreenFC<
  "LaunchpadERC20CreateAirdrop"
> = () => {
  const {
    stepIndice,
    actions: { gotoStep },
  } = useCreateAirdropState();
  const navigation = useAppNavigation();

  return (
    <ScreenContainer
      forceNetworkKind={NetworkKind.Gno}
      isLarge
      responsive
      headerChildren={
        <BrandText style={fontSemibold20}>
          Launchpad ERC20 Airdrop Creation
        </BrandText>
      }
      onBackPress={() => navigation.navigate("LaunchpadERC20Airdrops")}
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

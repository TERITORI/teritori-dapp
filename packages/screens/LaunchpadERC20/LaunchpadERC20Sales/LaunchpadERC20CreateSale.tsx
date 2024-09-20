import React from "react";
import { View } from "react-native";

import { CreateSaleForm } from "./LaunchpadERC20CreateSaleForm";
import { CreateSaleSign } from "./LaunchpadERC20CreateSaleSign";
import { LaunchpadERC20CreateSaleHeader } from "../component/LaunchpadERC20CreateSaleHeader";
import { useCreateSaleState } from "../hooks/useCreateSale";

import { Breadcrumb } from "@/components/Breadcrumb";
import { ScreenContainer } from "@/components/ScreenContainer";
import { SpacerColumn } from "@/components/spacer";
import { NetworkKind } from "@/networks";
import { ScreenFC } from "@/utils/navigation";

const renderStep = (stepIndice: number) => {
  if (stepIndice === 1) return <CreateSaleForm />;
  if (stepIndice === 2) return <CreateSaleSign />;
};

const STEPS = ["Informations", "Sign & Deploy"];

export const LaunchpadERC20CreateSaleScreen: ScreenFC<
  "LaunchpadERC20CreateSale"
> = () => {
  const {
    stepIndice,
    actions: { gotoStep },
  } = useCreateSaleState();

  return (
    <ScreenContainer
      forceNetworkKind={NetworkKind.Gno}
      isLarge
      responsive
      headerChildren={<LaunchpadERC20CreateSaleHeader />}
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

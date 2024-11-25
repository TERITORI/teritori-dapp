import React from "react";
import { View } from "react-native";

import { CreateSaleForm } from "./LaunchpadERC20CreateSaleForm";
import { CreateSaleSign } from "./LaunchpadERC20CreateSaleSign";
import { useCreateSaleState } from "../hooks/useCreateSale";

import { BrandText } from "@/components/BrandText";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ScreenContainer } from "@/components/ScreenContainer";
import { SpacerColumn } from "@/components/spacer";
import { NetworkKind } from "@/networks";
import { ScreenFC, useAppNavigation } from "@/utils/navigation";
import { fontSemibold20 } from "@/utils/style/fonts";

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
  const navigation = useAppNavigation();

  return (
    <ScreenContainer
      forceNetworkKind={NetworkKind.Gno}
      isLarge
      responsive
      headerChildren={
        <BrandText style={fontSemibold20}>
          Launchpad ERC20 Sale Creation
        </BrandText>
      }
      onBackPress={() => navigation.navigate("LaunchpadERC20Sales")}
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

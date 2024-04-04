import React, { FC, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { SpacerColumn } from "@/components/spacer";
import { useCreateCollection } from "@/hooks/launchpad/useCreateCollection";
import { NetworkFeature } from "@/networks";
import { LaunchpadSteper } from "@/screens/Launchpad/components/LaunchpadSteper";
import { LaunchpadAdditional } from "@/screens/Launchpad/components/launchpadCreateSteps/LaunchpadAdditional";
import { LaunchpadAssetsAndMetadata } from "@/screens/Launchpad/components/launchpadCreateSteps/LaunchpadAssetsAndMetadata";
import { LaunchpadBasic } from "@/screens/Launchpad/components/launchpadCreateSteps/LaunchpadBasic";
import { LaunchpadDetails } from "@/screens/Launchpad/components/launchpadCreateSteps/LaunchpadDetails";
import { LaunchpadMinting } from "@/screens/Launchpad/components/launchpadCreateSteps/LaunchpadMinting/LaunchpadMinting";
import { LaunchpadTeamAndInvestment } from "@/screens/Launchpad/components/launchpadCreateSteps/LaunchpadTeamAndInvestment";
import { ScreenFC, useAppNavigation } from "@/utils/navigation";
import { neutral33 } from "@/utils/style/colors";
import { layout } from "@/utils/style/layout";
import { CollectionFormValues } from "@/utils/types/launchpad";

const StepContent: FC<{
  step: number;
}> = ({ step }) => {
  switch (step) {
    case 1:
      return <LaunchpadBasic />;
    case 2:
      return <LaunchpadDetails />;
    case 3:
      return <LaunchpadTeamAndInvestment />;
    case 4:
      return <LaunchpadAdditional />;
    case 5:
      return <LaunchpadMinting />;
    case 6:
      return <LaunchpadAssetsAndMetadata />;
    default:
      return <></>;
  }
};

const stepOptions = [
  { key: 1, title: "Basic" },
  { key: 2, title: "Details" },
  { key: 3, title: "Team & Investments" },
  { key: 4, title: "Additional" },
  { key: 5, title: "Minting" },
  { key: 6, title: "Assets & Metadata" },
];

export const LaunchpadCreateScreen: ScreenFC<"LaunchpadCreate"> = () => {
  const navigation = useAppNavigation();
  const collectionForm = useForm<CollectionFormValues>({
    mode: "all",
  });
  const { createCollection } = useCreateCollection();
  const [selectedStep, setSelectedStep] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const coverImage = collectionForm.watch("coverImage");

  const onSubmit = async () => {
    setLoading(true);
    try {
      await createCollection(collectionForm.getValues());
      setLoading(false);
    } catch (e) {
      console.error("Error creating a NFT collection", e);
      setLoading(false);
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <ScreenContainer
      fullWidth
      noMargin
      noScroll={false}
      footerChildren={<></>}
      forceNetworkFeatures={[NetworkFeature.NFTLaunchpad]}
      headerChildren={<BrandText>Launchpad Submission Form</BrandText>}
      onBackPress={() => navigation.navigate("LaunchpadApply")}
    >
      <View
        style={{
          marginTop: layout.spacing_x3,
        }}
      >
        <LaunchpadSteper
          stepOptions={stepOptions}
          step={selectedStep}
          onStepPress={setSelectedStep}
        />

        <View
          style={{
            paddingHorizontal: layout.spacing_x3_5,
            zIndex: 1,
          }}
        >
          <SpacerColumn size={4} />
          <FormProvider {...collectionForm}>
            <StepContent step={selectedStep} />
          </FormProvider>
        </View>

        <View
          style={{
            borderTopWidth: 1,
            borderColor: neutral33,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginVertical: layout.spacing_x2,
              marginLeft: layout.spacing_x4,
              marginRight: layout.spacing_x2,
              justifyContent: selectedStep === 1 ? "flex-end" : "space-between",
            }}
          >
            {selectedStep !== 1 && (
              <SecondaryButton
                width={136}
                size="M"
                text="Back"
                loader
                onPress={() => {
                  setSelectedStep(selectedStep - 1);
                }}
              />
            )}

            {stepOptions.length === selectedStep ? (
              <PrimaryButton
                width={137}
                size="M"
                text="Submit"
                loader
                isLoading={isLoading}
                disabled={!collectionForm.formState.isValid || !coverImage}
                // WIP TODO: handleSubmit
                onPress={
                  onSubmit
                  // () => {
                  //   collectionForm.handleSubmit(onSubmit);
                  // }
                }
              />
            ) : (
              <PrimaryButton
                width={137}
                size="M"
                text="Next"
                loader
                isLoading={isLoading}
                onPress={() => setSelectedStep(selectedStep + 1)}
              />
            )}
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
};

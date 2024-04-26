import { zodResolver } from "@hookform/resolvers/zod";
import React, { FC, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { SpacerColumn } from "@/components/spacer";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { useCreateCollection } from "@/hooks/launchpad/useCreateCollection";
import { useSelectedNetworkInfo } from "@/hooks/useSelectedNetwork";
import { NetworkFeature } from "@/networks";
import {
  LaunchpadStepper,
  StepOption,
} from "@/screens/Launchpad/LaunchpadCreate/components/LaunchpadStepper";
import { LaunchpadAdditional } from "@/screens/Launchpad/LaunchpadCreate/components/steps/LaunchpadAdditional";
import { LaunchpadAssetsAndMetadata } from "@/screens/Launchpad/LaunchpadCreate/components/steps/LaunchpadAssetsAndMetadata/LaunchpadAssetsAndMetadata";
import { LaunchpadBasic } from "@/screens/Launchpad/LaunchpadCreate/components/steps/LaunchpadBasic";
import { LaunchpadDetails } from "@/screens/Launchpad/LaunchpadCreate/components/steps/LaunchpadDetails";
import { LaunchpadMinting } from "@/screens/Launchpad/LaunchpadCreate/components/steps/LaunchpadMinting/LaunchpadMinting";
import { LaunchpadTeamAndInvestment } from "@/screens/Launchpad/LaunchpadCreate/components/steps/LaunchpadTeamAndInvestment";
import { ScreenFC, useAppNavigation } from "@/utils/navigation";
import { neutral33 } from "@/utils/style/colors";
import { layout } from "@/utils/style/layout";
import {
  CollectionFormValues,
  ZodCollectionFormValues,
} from "@/utils/types/launchpad";

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

export const LaunchpadCreateScreen: ScreenFC<"LaunchpadCreate"> = () => {
  const navigation = useAppNavigation();
  const selectedNetwork = useSelectedNetworkInfo();
  const { setToast } = useFeedbacks();
  const collectionForm = useForm<CollectionFormValues>({
    mode: "all",
    defaultValues: {
      mintPeriods: [
        {
          price: {
            denom: selectedNetwork?.currencies[0].denom,
          },
          isOpen: true,
        },
      ],
    },
    resolver: zodResolver(ZodCollectionFormValues),
  });
  const { createCollection } = useCreateCollection();
  const [selectedStep, setSelectedStep] = useState(1);
  const [isLoading, setLoading] = useState(false);

  const stepOptions: StepOption[] = [
    {
      key: 1,
      title: "Basic",
    },
    {
      key: 2,
      title: "Details",
    },
    {
      key: 3,
      title: "Team & Investments",
    },
    {
      key: 4,
      title: "Additional",
    },
    {
      key: 5,
      title: "Minting",
    },
    {
      key: 6,
      title: "Assets & Metadata",
    },
  ];

  const onValid = async () => {
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

  const onInvalid = () => {
    setToast({
      mode: "normal",
      type: "error",
      title: "Unable to create the collection",
      message: "Some fields are not correctly filled",
    });
  };

  const onPressSubmit = () => collectionForm.handleSubmit(onValid, onInvalid)();

  return (
    <ScreenContainer
      fullWidth
      noMargin
      noScroll={false}
      footerChildren={<></>}
      forceNetworkFeatures={[NetworkFeature.NFTLaunchpad]}
      // TODO: Remove after tests
      forceNetworkId="teritori-testnet"
      headerChildren={<BrandText>Collection Creation</BrandText>}
      onBackPress={() => navigation.navigate("LaunchpadApply")}
    >
      <View
        style={{
          marginTop: layout.spacing_x3,
        }}
      >
        <LaunchpadStepper
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
                width={220}
                size="M"
                text="Submit Collection"
                loader
                isLoading={isLoading}
                // TODO: disabled or let the user press and see the error ?
                // disabled={
                //   !collectionForm.formState.isValid ||
                //   !coverImage ||
                //   !!Object.keys(collectionForm.formState.errors).length
                // }
                onPress={onPressSubmit}
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

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { useCreateCollection } from "@/hooks/launchpad/useCreateCollection";
import { useSelectedNetworkInfo } from "@/hooks/useSelectedNetwork";
import { NetworkFeature } from "@/networks";
import {
  LaunchpadCreateStep,
  LaunchpadCreateStepKey,
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

const steps: LaunchpadCreateStep[] = [
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
  const [selectedStepKey, setSelectedStepKey] =
    useState<LaunchpadCreateStepKey>(1);
  const [isLoading, setLoading] = useState(false);
  const { setLoadingFullScreen } = useFeedbacks();

  const stepContent = useMemo(() => {
    switch (selectedStepKey) {
      case 1:
        return (
          <LaunchpadBasic
            steps={steps}
            setSelectedStepKey={setSelectedStepKey}
          />
        );
      case 2:
        return (
          <LaunchpadDetails
            steps={steps}
            setSelectedStepKey={setSelectedStepKey}
          />
        );
      case 3:
        return (
          <LaunchpadTeamAndInvestment
            steps={steps}
            setSelectedStepKey={setSelectedStepKey}
          />
        );
      case 4:
        return (
          <LaunchpadAdditional
            steps={steps}
            setSelectedStepKey={setSelectedStepKey}
          />
        );
      case 5:
        return (
          <LaunchpadMinting
            steps={steps}
            setSelectedStepKey={setSelectedStepKey}
          />
        );
      case 6:
        return (
          <LaunchpadAssetsAndMetadata
            steps={steps}
            setSelectedStepKey={setSelectedStepKey}
          />
        );
      default:
        return (
          <LaunchpadBasic
            steps={steps}
            setSelectedStepKey={setSelectedStepKey}
          />
        );
    }
  }, [selectedStepKey]);

  const onValid = async () => {
    setLoading(true);
    setLoadingFullScreen(true);
    try {
      await createCollection(collectionForm.getValues());
      setLoading(false);
      setLoadingFullScreen(false);
    } catch (e) {
      console.error("Error creating a NFT collection", e);
      setLoading(false);
      setLoadingFullScreen(false);
    }
    setTimeout(() => {
      setLoading(false);
      setLoadingFullScreen(false);
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
      responsive
      footerChildren={<></>}
      forceNetworkFeatures={[NetworkFeature.NFTLaunchpad]}
      // TODO: Remove after tests
      forceNetworkId="teritori-testnet"
      headerChildren={<BrandText>Apply to Launchpad</BrandText>}
      onBackPress={() => navigation.navigate("LaunchpadApply")}
    >
      <View
        style={{
          paddingTop: layout.spacing_x3,
          height: "100%",
        }}
      >
        <FormProvider {...collectionForm}>{stepContent}</FormProvider>
        <View
          style={{
            zIndex: 1,
            borderTopWidth: 1,
            borderColor: neutral33,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              margin: layout.spacing_x2,
              justifyContent:
                selectedStepKey === 1 ? "flex-end" : "space-between",
            }}
          >
            {selectedStepKey !== 1 && (
              <SecondaryButton
                width={120}
                size="M"
                text="Back"
                loader
                onPress={() => setSelectedStepKey(selectedStepKey - 1)}
              />
            )}

            {selectedStepKey === steps.length ? (
              <PrimaryButton
                width={160}
                size="M"
                text="Submit Collection"
                loader
                isLoading={isLoading}
                disabled={isLoading}
                onPress={onPressSubmit}
              />
            ) : (
              <PrimaryButton
                width={137}
                size="M"
                text="Next"
                loader
                isLoading={isLoading}
                onPress={() => setSelectedStepKey(selectedStepKey + 1)}
              />
            )}
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
};

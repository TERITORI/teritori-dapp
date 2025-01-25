import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { View } from "react-native";
import { useSelector } from "react-redux";

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
  LaunchpadCreateStepKey,
  LaunchpadStepper,
} from "@/screens/Launchpad/LaunchpadApply/LaunchpadCreate/components/LaunchpadStepper";
import { LaunchpadAdditional } from "@/screens/Launchpad/LaunchpadApply/LaunchpadCreate/components/steps/LaunchpadAdditional";
import { LaunchpadAssetsAndMetadata } from "@/screens/Launchpad/LaunchpadApply/LaunchpadCreate/components/steps/LaunchpadAssetsAndMetadata/LaunchpadAssetsAndMetadata";
import { LaunchpadBasic } from "@/screens/Launchpad/LaunchpadApply/LaunchpadCreate/components/steps/LaunchpadBasic";
import { LaunchpadDetails } from "@/screens/Launchpad/LaunchpadApply/LaunchpadCreate/components/steps/LaunchpadDetails";
import { LaunchpadMinting } from "@/screens/Launchpad/LaunchpadApply/LaunchpadCreate/components/steps/LaunchpadMinting/LaunchpadMinting";
import { LaunchpadTeamAndInvestment } from "@/screens/Launchpad/LaunchpadApply/LaunchpadCreate/components/steps/LaunchpadTeamAndInvestment";
import { selectNFTStorageAPI } from "@/store/slices/settings";
import { ScreenFC, useAppNavigation } from "@/utils/navigation";
import { neutral33 } from "@/utils/style/colors";
import { layout } from "@/utils/style/layout";
import {
  CollectionFormValues,
  ZodCollectionFormValues,
} from "@/utils/types/launchpad";

export const launchpadCreateFormMaxWidth = 416;

export const LaunchpadCreateScreen: ScreenFC<"LaunchpadCreate"> = () => {
  const navigation = useAppNavigation();
  const selectedNetwork = useSelectedNetworkInfo();
  const { setToast } = useFeedbacks();
  const userIPFSKey = useSelector(selectNFTStorageAPI);
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
      assetsMetadatas: {
        nftApiKey: userIPFSKey,
      },
    },
    resolver: zodResolver(ZodCollectionFormValues),
  });
  const { createCollection } = useCreateCollection();
  const [selectedStepKey, setSelectedStepKey] =
    useState<LaunchpadCreateStepKey>(1);
  const [isLoading, setLoading] = useState(false);
  const { setLoadingFullScreen } = useFeedbacks();

  const stepContent = useCallback(
    (collectionForm: UseFormReturn<CollectionFormValues>) => {
      switch (selectedStepKey) {
        case 1:
          return <LaunchpadBasic collectionForm={collectionForm} />;
        case 2:
          return <LaunchpadDetails collectionForm={collectionForm} />;
        case 3:
          return <LaunchpadTeamAndInvestment collectionForm={collectionForm} />;
        case 4:
          return <LaunchpadAdditional collectionForm={collectionForm} />;
        case 5:
          return <LaunchpadMinting collectionForm={collectionForm} />;
        case 6:
          return <LaunchpadAssetsAndMetadata collectionForm={collectionForm} />;
        default:
          return <LaunchpadBasic collectionForm={collectionForm} />;
      }
    },
    [selectedStepKey],
  );

  const onValid = async () => {
    setLoading(true);
    setLoadingFullScreen(true);
    try {
      // TODO: Uncomment when the NFT Launchpad MyCollections frontend is merged
      // const success =
      await createCollection(collectionForm.getValues());
      // TODO: Uncomment when the NFT Launchpad MyCollections frontend is merged
      // if (success) navigation.navigate("LaunchpadMyCollections");
    } catch (e) {
      console.error("Error creating a NFT collection", e);
    } finally {
      setLoading(false);
      setLoadingFullScreen(false);
    }
  };

  const onInvalid = () => {
    setToast({
      mode: "normal",
      type: "error",
      title: "Unable to create the collection",
      message:
        "Some fields are not correctly filled." +
        "\nMaybe from the mapping file, please complete it properly.\nCheck the description for more information.",
    });
  };

  const onPressSubmit = () => collectionForm.handleSubmit(onValid, onInvalid)();

  return (
    <ScreenContainer
      fullWidth
      responsive
      footerChildren={<></>}
      forceNetworkFeatures={[NetworkFeature.CosmWasmNFTLaunchpad]}
      headerChildren={<BrandText>Apply to Launchpad</BrandText>}
      onBackPress={() => navigation.navigate("LaunchpadApply")}
      // TODO: Remove after tests
      forceNetworkId="teritori-testnet"
    >
      <View
        style={{
          paddingTop: layout.spacing_x3,
          height: "100%",
        }}
      >
        <LaunchpadStepper
          collectionForm={collectionForm}
          selectedStepKey={selectedStepKey}
          setSelectedStepKey={setSelectedStepKey}
        />
        <SpacerColumn size={4} />
        {stepContent(collectionForm)}

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

            {selectedStepKey === 6 ? (
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

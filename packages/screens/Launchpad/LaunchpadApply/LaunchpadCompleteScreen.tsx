import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { View } from "react-native";
import { useSelector } from "react-redux";

import { TextInputLaunchpad } from "./components/inputs/TextInputLaunchpad";

import { BrandText } from "@/components/BrandText";
import { NotFound } from "@/components/NotFound";
import { ScreenContainer } from "@/components/ScreenContainer";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SpacerColumn } from "@/components/spacer";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { useCompleteCollection } from "@/hooks/launchpad/useCompleteCollection";
import { useLaunchpadProjectById } from "@/hooks/launchpad/useLaunchpadProjectById";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { NetworkFeature } from "@/networks";
import { AssetsAndMetadataInputs } from "@/screens/Launchpad/LaunchpadApply/LaunchpadCreate/components/steps/LaunchpadAssetsAndMetadata/AssetsAndMetadataInputs";
import { selectNFTStorageAPI } from "@/store/slices/settings";
import { ScreenFC, useAppNavigation } from "@/utils/navigation";
import {
  neutral33,
  neutral55,
  neutral77,
  primaryColor,
} from "@/utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold28,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import {
  CollectionAssetsMetadatasFormValues,
  CollectionFormValues,
  ZodCollectionAssetsMetadatasFormValues,
} from "@/utils/types/launchpad";

export const LaunchpadCompleteScreen: ScreenFC<"LaunchpadComplete"> = ({
  route,
}) => {
  const isMobile = useIsMobile();
  const { setToast } = useFeedbacks();
  const userIPFSKey = useSelector(selectNFTStorageAPI);
  const { id: symbol } = route.params;
  const selectedNetworkId = useSelectedNetworkId();
  const navigation = useAppNavigation();
  const selectedWallet = useSelectedWallet();
  const { completeCollection } = useCompleteCollection();
  const { launchpadProject } = useLaunchpadProjectById({
    networkId: selectedNetworkId,
    projectId: symbol,
  });
  const assetsMetadatasForm = useForm<CollectionAssetsMetadatasFormValues>({
    mode: "all",
    resolver: zodResolver(ZodCollectionAssetsMetadatasFormValues),
    defaultValues: { assetsMetadatas: [], nftApiKey: userIPFSKey },
  });
  const [isLoading, setLoading] = useState(false);
  const { setLoadingFullScreen } = useFeedbacks();
  const assetsMetadatas = assetsMetadatasForm.watch("assetsMetadatas");
  const nftApiKey = assetsMetadatasForm.watch("nftApiKey");

  const onValid = async () => {
    setLoading(true);
    setLoadingFullScreen(true);
    try {
      const success = await completeCollection(
        symbol,
        assetsMetadatasForm.getValues(),
      );
      setLoading(false);
      setLoadingFullScreen(false);
      if (success) navigation.navigate("LaunchpadMyCollections");
    } catch (e) {
      console.error("Error completing the NFT collection", e);
    } finally {
      setLoading(false);
      setLoadingFullScreen(false);
    }
  };

  const onInvalid = (fieldsErrors: FieldErrors<CollectionFormValues>) => {
    console.error("Fields errors: ", fieldsErrors);
    setToast({
      mode: "normal",
      type: "error",
      title: "Unable to complete the collection",
      message:
        "Some fields are not correctly filled.\nPlease complete properly the mapping file.\nCheck the description for more information.",
    });
  };

  const onPressComplete = () =>
    assetsMetadatasForm.handleSubmit(onValid, onInvalid)();

  return (
    <ScreenContainer
      fullWidth
      responsive
      footerChildren={<></>}
      forceNetworkFeatures={[NetworkFeature.CosmWasmNFTLaunchpad]}
      // TODO: Remove after tests
      forceNetworkId="teritori-testnet"
      headerChildren={<BrandText>Collection Completion</BrandText>}
      onBackPress={() => navigation.navigate("LaunchpadMyCollections")}
    >
      <View
        style={{
          width: "100%",
          flex: 1,
          marginBottom: 81,
        }}
      >
        {!selectedWallet?.userId ? (
          <BrandText style={{ alignSelf: "center" }}>
            You are not connected
          </BrandText>
        ) : !launchpadProject ? (
          <NotFound label="Collection" />
        ) : launchpadProject.networkId !== selectedNetworkId ? (
          <BrandText style={{ alignSelf: "center" }}>Wrong network</BrandText>
        ) : selectedWallet.userId !== launchpadProject?.creatorId ? (
          <BrandText style={{ alignSelf: "center" }}>
            You don't own this Collection
          </BrandText>
        ) : (
          <View
            style={{
              height: "100%",
            }}
          >
            <View
              style={{
                height: "100%",
                paddingHorizontal: isMobile ? 0 : layout.spacing_x3,
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: layout.spacing_x4,
                }}
              >
                <BrandText style={fontSemibold28}>Assets & Metadata</BrandText>
                <SpacerColumn size={2} />

                <BrandText
                  style={[
                    fontSemibold14,
                    {
                      color: neutral77,
                    },
                  ]}
                >
                  Make sure you check out{" "}
                  <BrandText
                    style={[
                      fontSemibold14,
                      {
                        color: primaryColor,
                      },
                    ]}
                  >
                    documentation
                  </BrandText>{" "}
                  on how to create your collection
                </BrandText>
              </View>

              <View style={{ maxWidth: 500, paddingLeft: layout.spacing_x2 }}>
                <TextInputLaunchpad<CollectionAssetsMetadatasFormValues>
                  label="NFT.Storage JWT"
                  sublabel={
                    <BrandText style={[fontSemibold13, { color: neutral55 }]}>
                      Used to upload the cover image and the assets to your NFT
                      Storage
                    </BrandText>
                  }
                  placeHolder="My Awesome Collection"
                  name="nftApiKey"
                  form={assetsMetadatasForm}
                />
              </View>

              <AssetsAndMetadataInputs
                assetsMetadatasForm={assetsMetadatasForm}
              />
            </View>

            <View
              style={{
                zIndex: 1,
                borderTopWidth: 1,
                borderColor: neutral33,
                alignItems: "flex-end",
              }}
            >
              <PrimaryButton
                size="M"
                text="Complete Collection"
                loader
                isLoading={isLoading}
                disabled={isLoading || !assetsMetadatas?.length || !nftApiKey}
                onPress={onPressComplete}
                boxStyle={{ margin: layout.spacing_x2 }}
              />
            </View>
          </View>
        )}
      </View>
    </ScreenContainer>
  );
};

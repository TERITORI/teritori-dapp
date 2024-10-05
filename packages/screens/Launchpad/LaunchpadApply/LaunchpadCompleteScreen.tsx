import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { FieldErrors, FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";

import { BrandText } from "@/components/BrandText";
import { NotFound } from "@/components/NotFound";
import { ScreenContainer } from "@/components/ScreenContainer";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SpacerColumn } from "@/components/spacer";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { useCollectionById } from "@/hooks/launchpad/useCollectionById";
import { useCompleteCollection } from "@/hooks/launchpad/useCompleteCollection";
import { useIsMobile } from "@/hooks/useIsMobile";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { NetworkFeature } from "@/networks";
import { AssetsTab } from "@/screens/Launchpad/LaunchpadApply/LaunchpadCreate/components/steps/LaunchpadAssetsAndMetadata/AssetsTab";
import { ScreenFC, useAppNavigation } from "@/utils/navigation";
import { neutral33, neutral55, neutral77, primaryColor } from "@/utils/style/colors";
import { fontSemibold13, fontSemibold14, fontSemibold28 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import {
  CollectionAssetsMetadatasFormValues,
  CollectionFormValues,
  ZodCollectionAssetsMetadatasFormValues,
} from "@/utils/types/launchpad";
import { useSelector } from "react-redux";
import { selectNFTStorageAPI } from "@/store/slices/settings";
import { TextInputLaunchpad } from "./components/inputs/TextInputLaunchpad";

export const LaunchpadCompleteScreen: ScreenFC<"LaunchpadComplete"> = ({
  route,
}) => {
  const isMobile = useIsMobile();
  const { setToast } = useFeedbacks();
  const userIPFSKey = useSelector(selectNFTStorageAPI);
  const { id: collectionId } = route.params;
  const navigation = useAppNavigation();
  const selectedWallet = useSelectedWallet();
  const { completeCollection } = useCompleteCollection();
  const { collection } = useCollectionById({ collectionId });
  const assetsMetadatasForm = useForm<CollectionAssetsMetadatasFormValues>({
    mode: "all",
    resolver: zodResolver(ZodCollectionAssetsMetadatasFormValues),
    defaultValues: { assetsMetadatas: [], nftApiKey: userIPFSKey },
  });
  const [isLoading, setLoading] = useState(false);
  const { setLoadingFullScreen } = useFeedbacks();

  const onValid = async () => {
    setLoading(true);
    setLoadingFullScreen(true);
    try {
      const assetsMetadatasFormValues = assetsMetadatasForm.getValues();
      if (!assetsMetadatasFormValues.assetsMetadatas?.length) return;
      await completeCollection(
        collectionId,
        assetsMetadatasFormValues,
      );

      setLoading(false);
      setLoadingFullScreen(false);
    } catch (e) {
      console.error("Error completing the NFT collection", e);
      setLoading(false);
      setLoadingFullScreen(false);
    }
    setTimeout(() => {
      setLoading(false);
      setLoadingFullScreen(false);
    }, 1000);
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


  console.log('assetsMetadatasForm.getValues()', assetsMetadatasForm.getValues())

  return (
    <ScreenContainer
      fullWidth
      responsive
      footerChildren={<></>}
      forceNetworkFeatures={[NetworkFeature.NFTLaunchpad]}
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
        ) : !collection ? (
          <NotFound label="Collection" />
        ) : selectedWallet.address !== collection?.owner ? (
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

              <FormProvider {...assetsMetadatasForm}>
                <View style={{maxWidth: 500, paddingLeft: layout.spacing_x2}}>
              <TextInputLaunchpad<CollectionAssetsMetadatasFormValues>
                label="NFT.Storage JWT"
                sublabel={
                <BrandText style={[fontSemibold13, { color: neutral55 }]}>
                Used to upload the cover image and the assets to your NFT Storage
                </BrandText>
                }
                placeHolder="My Awesome Collection"
                name="nftApiKey"
                form={assetsMetadatasForm}
              />
              </View>

                <AssetsTab />
              </FormProvider>
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
                disabled={isLoading || !assetsMetadatasForm.getValues().assetsMetadatas?.length}
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

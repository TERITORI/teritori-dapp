import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";

import { BrandText } from "@/components/BrandText";
import { NotFound } from "@/components/NotFound";
import { ScreenContainer } from "@/components/ScreenContainer";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SpacerColumn } from "@/components/spacer";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { Collection } from "@/contracts-clients/nft-launchpad";
import { useCollectionById } from "@/hooks/launchpad/useCollectionById";
import { useCompleteCollection } from "@/hooks/launchpad/useCompleteCollection";
import { useIsMobile } from "@/hooks/useIsMobile";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { NetworkFeature } from "@/networks";
import { AssetsTab } from "@/screens/Launchpad/LaunchpadCreate/components/steps/LaunchpadAssetsAndMetadata/AssetsTab";
import { ScreenFC, useAppNavigation } from "@/utils/navigation";
import { neutral33, neutral77, primaryColor } from "@/utils/style/colors";
import { fontSemibold14, fontSemibold28 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import {
  CollectionAssetsMetadatasFormValues,
  ZodCollectionAssetsMetadatasFormValues,
} from "@/utils/types/launchpad";

export const LaunchpadCompleteScreen: ScreenFC<"LaunchpadComplete"> = ({
  route,
}) => {
  const isMobile = useIsMobile();
  const { id } = route.params;
  const navigation = useAppNavigation();
  const selectedWallet = useSelectedWallet();
  const { completeCollection } = useCompleteCollection();
  const { getCollectionById } = useCollectionById();
  const [collection, setCollection] = useState<Collection>();
  const assetsMetadatasForm = useForm<CollectionAssetsMetadatasFormValues>({
    mode: "all",
    resolver: zodResolver(ZodCollectionAssetsMetadatasFormValues),
  });
  const [isLoading, setLoading] = useState(false);
  const { setLoadingFullScreen } = useFeedbacks();

  const onPressComplete = async () => {
    setLoading(true);
    setLoadingFullScreen(true);
    try {
      const assetsMetadatasFormValues = assetsMetadatasForm.getValues();
      if (!assetsMetadatasFormValues.assetsMetadatas?.length) return;
      await completeCollection(id, assetsMetadatasFormValues.assetsMetadatas);

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

  useEffect(() => {
    const effect = async () => {
      const collectionById = await getCollectionById(id);
      setCollection(collectionById);
    };
    effect();
  }, [getCollectionById, id]);

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
                disabled={isLoading || !assetsMetadatasForm.getValues()}
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

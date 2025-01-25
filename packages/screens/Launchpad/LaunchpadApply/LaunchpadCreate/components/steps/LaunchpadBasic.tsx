import { FC } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { View } from "react-native";

import { BrandText } from "@/components/BrandText";
import { ErrorText } from "@/components/ErrorText";
import { NetworkSelectorWithLabel } from "@/components/NetworkSelector/NetworkSelectorWithLabel";
import { FileUploaderSmall } from "@/components/inputs/FileUploaderSmall";
import { SpacerColumn } from "@/components/spacer";
import { NetworkFeature } from "@/networks";
import { launchpadCreateFormMaxWidth } from "@/screens/Launchpad/LaunchpadApply/LaunchpadCreate/LaunchpadCreateScreen";
import { TextInputLaunchpad } from "@/screens/Launchpad/LaunchpadApply/components/inputs/TextInputLaunchpad";
import { IMAGE_MIME_TYPES } from "@/utils/mime";
import { neutral55, neutral77, primaryColor } from "@/utils/style/colors";
import { fontMedium13, fontMedium14, fontMedium28 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { CollectionFormValues } from "@/utils/types/launchpad";

interface Props {
  collectionForm: UseFormReturn<CollectionFormValues>;
}

export const LaunchpadBasic: FC<Props> = ({ collectionForm }) => {
  const coverImage = collectionForm.watch("coverImage");

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <BrandText style={fontMedium28}>Create Collection</BrandText>

        <SpacerColumn size={2} />

        <BrandText
          style={[
            fontMedium14,
            {
              color: neutral77,
            },
          ]}
        >
          Make sure you check out{" "}
          <BrandText
            style={[
              fontMedium14,
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
      <View style={{ maxWidth: launchpadCreateFormMaxWidth, width: "100%" }}>
        <SpacerColumn size={2} />

        <TextInputLaunchpad<CollectionFormValues>
          label="Name"
          placeHolder="My Awesome Collection"
          name="name"
          form={collectionForm}
        />

        <TextInputLaunchpad<CollectionFormValues>
          label="Describe your project: "
          sublabel={
            <View>
              <BrandText style={[fontMedium13, { color: neutral55 }]}>
                1. What's your concept?
              </BrandText>
              <BrandText style={[fontMedium13, { color: neutral55 }]}>
                2. How is it different?
              </BrandText>
              <BrandText style={[fontMedium13, { color: neutral55 }]}>
                3. What's your goal?
              </BrandText>
            </View>
          }
          placeHolder="Describe here..."
          name="description"
          form={collectionForm}
        />

        <TextInputLaunchpad<CollectionFormValues>
          label="Symbol"
          placeHolder="Symbol"
          name="symbol"
          form={collectionForm}
          valueModifier={(value) => value.toUpperCase()}
        />

        <Controller<CollectionFormValues>
          control={collectionForm.control}
          name="coverImage"
          render={({ field: { onChange } }) => (
            <>
              <FileUploaderSmall
                label="Cover Image"
                onUpload={(files) => {
                  onChange(files[0]);
                }}
                filesCount={coverImage ? 1 : 0}
                mimeTypes={IMAGE_MIME_TYPES}
                required
                imageToShow={coverImage}
                onPressDelete={() => onChange(undefined)}
              />
              <ErrorText>
                {collectionForm.getFieldState("coverImage").error?.message}
              </ErrorText>
            </>
          )}
        />
        <SpacerColumn size={2} />

        <TextInputLaunchpad<CollectionFormValues>
          label="NFT.Storage JWT"
          sublabel={
            <BrandText style={[fontMedium13, { color: neutral55 }]}>
              Used to upload the cover image and the assets to your NFT Storage
            </BrandText>
          }
          placeHolder="My Awesome Collection"
          name="assetsMetadatas.nftApiKey"
          form={collectionForm}
        />

        <NetworkSelectorWithLabel
          forceNetworkFeatures={[NetworkFeature.CosmWasmNFTLaunchpad]}
          style={{ marginBottom: layout.spacing_x3 }}
          label="Which network is your project on?"
        />
      </View>
    </View>
  );
};

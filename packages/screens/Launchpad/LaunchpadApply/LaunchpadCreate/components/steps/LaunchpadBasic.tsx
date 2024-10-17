import React, { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { View } from "react-native";

import { BrandText } from "@/components/BrandText";
import { ErrorText } from "@/components/ErrorText";
import { NetworkSelectorWithLabel } from "@/components/NetworkSelector/NetworkSelectorWithLabel";
import { FileUploaderSmall } from "@/components/inputs/FileUploaderSmall";
import { SpacerColumn } from "@/components/spacer";
import { NetworkFeature } from "@/networks";
import { TextInputLaunchpad } from "@/screens/Launchpad/LaunchpadApply/components/inputs/TextInputLaunchpad";
import { IMAGE_MIME_TYPES } from "@/utils/mime";
import { neutral55, neutral77, primaryColor } from "@/utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold28,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { CollectionFormValues } from "@/utils/types/launchpad";

export const LaunchpadBasic: FC = () => {
  const collectionForm = useFormContext<CollectionFormValues>();
  const coverImage = collectionForm.watch("coverImage");

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <BrandText style={fontSemibold28}>Create Collection</BrandText>

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
      <View style={{ maxWidth: 416, width: "100%" }}>
        <SpacerColumn size={2} />

        <TextInputLaunchpad<CollectionFormValues>
          label="Name"
          placeHolder="My Awesome Collection"
          name="name"
          form={collectionForm}
        />

        <TextInputLaunchpad<CollectionFormValues>
          label="Description"
          placeHolder="My Awesome Collection Description"
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
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              Used to upload the cover image and the assets to your NFT Storage
            </BrandText>
          }
          placeHolder="My Awesome Collection"
          name="assetsMetadatas.nftApiKey"
          form={collectionForm}
        />

        {/*<TextInputLaunchpad<CollectionFormValues>*/}
        {/*  label="External Link"*/}
        {/*  placeHolder="https://collection..."*/}
        {/*  name="externalLink"*/}
        {/*  form={collectionForm}*/}
        {/*  required={false}*/}
        {/*/>*/}

        <NetworkSelectorWithLabel
          forceNetworkFeatures={[NetworkFeature.NFTLaunchpad]}
          style={{ marginBottom: layout.spacing_x3 }}
          label="Which network is your project on?"
        />
      </View>
    </View>
  );
};

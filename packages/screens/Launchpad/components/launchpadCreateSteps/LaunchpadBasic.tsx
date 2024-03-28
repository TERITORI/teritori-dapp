import React from "react";
import { UseFormReturn } from "react-hook-form";
import { View } from "react-native";

import { CollectionFormValues } from "../../CreateCollection.type";
import { TextInputLaunchpadRequired } from "../inputs/TextInputLaunchpadRequired";

import { BrandText } from "@/components/BrandText";
import { CustomNetworkSelector } from "@/components/NetworkSelector/CustomNetworkSelector";
import { SelectFileUploader } from "@/components/selectFileUploader";
import { SpacerColumn } from "@/components/spacer";
import { NetworkFeature } from "@/networks";
import { TextInputLaunchpad } from "@/screens/Launchpad/components/inputs/TextInputLaunchpad";
import { IMAGE_MIME_TYPES } from "@/utils/mime";
import { ARTICLE_THUMBNAIL_IMAGE_MAX_HEIGHT } from "@/utils/social-feed";
import { neutral77, primaryColor } from "@/utils/style/colors";
import { fontSemibold14, fontSemibold28 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { LocalFileData } from "@/utils/types/files";

export const LaunchpadBasic: React.FC<{
  createCollectionForm: UseFormReturn<CollectionFormValues>;
  onChangeCoverImage: (file: LocalFileData) => void;
}> = ({ createCollectionForm, onChangeCoverImage }) => {
  const coverImage = createCollectionForm.watch("coverImage");

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
      <View style={{ width: 416 }}>
        <SpacerColumn size={2} />

        {/*<TextInputCustom<CreateDaoFormType>*/}
        {/*  noBrokenCorners*/}
        {/*  variant="labelOutside"*/}
        {/*  control={control}*/}
        {/*  label="Organization's name"*/}
        {/*  placeHolder="Type organization's name here"*/}
        {/*  name="organizationName"*/}
        {/*  rules={{ required: true }}*/}
        {/*/>*/}

        <TextInputLaunchpadRequired<CollectionFormValues>
          label="Name"
          placeHolder="My Awesome Collection"
          name="name"
          control={createCollectionForm.control}
          // control={control}
          onChangeText={(e) => {
            console.log("eeee", e);
          }}
          onChange={(e) => {
            console.log("eeee", e);
          }}
        />

        <TextInputLaunchpadRequired<CollectionFormValues>
          label="Description"
          placeHolder="My Awesome Collection Description"
          name="description"
          control={createCollectionForm.control}
          // control={control}
        />

        <TextInputLaunchpadRequired<CollectionFormValues>
          label="Symbol"
          placeHolder="Symbol"
          name="symbol"
          control={createCollectionForm.control}
          // control={control}
        />

        <SelectFileUploader
          files={coverImage ? [coverImage] : []}
          label="Cover Image"
          fileHeight={ARTICLE_THUMBNAIL_IMAGE_MAX_HEIGHT}
          isImageCover
          style={{
            marginBottom: layout.spacing_x2,
            width: 416,
          }}
          containerHeight={48}
          onUpload={(files) => {
            createCollectionForm.setValue("coverImage", files[0]);
          }}
          mimeTypes={IMAGE_MIME_TYPES}
        />

        {/*>*/}
        {/*  {({ onPress }) => (*/}
        {/*    <BrandText>aaa</BrandText>*/}
        {/*  )}*/}
        {/*</SelectFileUploader>*/}

        <TextInputLaunchpad<CollectionFormValues>
          label="External Link"
          placeHolder="https://collection..."
          name="externalLink"
          control={createCollectionForm.control}
          // control={control}
        />

        <CustomNetworkSelector
          forceNetworkFeatures={[NetworkFeature.NFTLaunchpad]}
          style={{ marginBottom: layout.spacing_x3 }}
          label="Which network is your project on?"
        />
      </View>
    </View>
  );
};

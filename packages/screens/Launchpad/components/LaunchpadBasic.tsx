import React from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";

import { TextInputLaunchpadRequired } from "./inputs/TextInputLaunchpadRequired";
import { NewCollectionBasicFormValues } from "../CreateCollection.type";

import { BrandText } from "@/components/BrandText";
import { CustomNetworkSelector } from "@/components/NetworkSelector/CustomNetworkSelector";
import { SelectFileUploader } from "@/components/selectFileUploader";
import { SpacerColumn } from "@/components/spacer";
import { IMAGE_MIME_TYPES } from "@/utils/mime";
import { ARTICLE_THUMBNAIL_IMAGE_MAX_HEIGHT } from "@/utils/social-feed";
import { neutral77, primaryColor } from "@/utils/style/colors";
import { fontSemibold14, fontSemibold28 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const LaunchpadBasic: React.FC = () => {
  const { control } = useForm<NewCollectionBasicFormValues>({
    defaultValues: {
      name: "",
      description: "",
      symbol: "",
      externalLink: "",
    },
    mode: "onBlur",
  });

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

        <TextInputLaunchpadRequired<NewCollectionBasicFormValues>
          label="Name"
          placeHolder="My Awesome Collection"
          name="name"
          control={control}
        />

        <TextInputLaunchpadRequired<NewCollectionBasicFormValues>
          label="Description"
          placeHolder="My Awesome Collection Description"
          name="description"
          control={control}
        />

        <TextInputLaunchpadRequired<NewCollectionBasicFormValues>
          label="Symbol"
          placeHolder="Symbol"
          name="symbol"
          control={control}
        />

        <SelectFileUploader
          label="Cover Image"
          fileHeight={ARTICLE_THUMBNAIL_IMAGE_MAX_HEIGHT}
          isImageCover
          style={{
            marginBottom: layout.spacing_x2,
            width: 416,
          }}
          containerHeight={48}
          onUpload={(files) => {}}
          mimeTypes={IMAGE_MIME_TYPES}
        />

        <TextInputLaunchpadRequired<NewCollectionBasicFormValues>
          label="External Link"
          placeHolder="https://collection..."
          name="externalLink"
          control={control}
          required={false}
        />

        <CustomNetworkSelector
          style={{ marginBottom: layout.spacing_x3 }}
          label="What network is your project on?"
        />
      </View>
    </View>
  );
};

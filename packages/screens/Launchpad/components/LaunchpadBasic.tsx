import React from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";

import { TextInputLaunchpadBasicValues } from "./inputs/TextInputLaunchpadBasicValues";
import { BrandText } from "../../../components/BrandText";
import { CustomNetworkSelector } from "../../../components/NetworkSelector/CustomNetworkSelector";
import { SelectFileUploader } from "../../../components/selectFileUploader";
import { SpacerColumn } from "../../../components/spacer";
import { IMAGE_MIME_TYPES } from "../../../utils/mime";
import { ARTICLE_THUMBNAIL_IMAGE_MAX_HEIGHT } from "../../../utils/social-feed";
import { neutral77, primaryColor } from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold28 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { NewCollectionBasicFormValues } from "../CreateCollection.type";

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

        <TextInputLaunchpadBasicValues
          label="Name"
          placeHolder="My Awesome Collection"
          name="name"
          control={control}
        />

        <TextInputLaunchpadBasicValues
          label="Description"
          placeHolder="My Awesome Collection Description"
          name="description"
          control={control}
        />

        <TextInputLaunchpadBasicValues
          label="Symbol"
          placeHolder="Symbol"
          name="symbol"
          control={control}
        />

        <SelectFileUploader
          label="Cover Image *"
          fileHeight={ARTICLE_THUMBNAIL_IMAGE_MAX_HEIGHT}
          isImageCover
          style={{
            marginVertical: layout.spacing_x3,
            width: 416,
          }}
          containerHeight={48}
          onUpload={(files) => {}}
          mimeTypes={IMAGE_MIME_TYPES}
        />

        <TextInputLaunchpadBasicValues
          label="External Link"
          placeHolder="https://collection..."
          name="externalLink"
          control={control}
        />

        <CustomNetworkSelector
          style={{ marginBottom: layout.spacing_x3 }}
          label="What network is your project on? *"
        />
      </View>
    </View>
  );
};

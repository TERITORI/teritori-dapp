import React from "react";
import { useFormContext } from "react-hook-form";
import { View } from "react-native";

import { CollectionFormValues } from "../../../../utils/types/launchpad";

import { BrandText } from "@/components/BrandText";
import { NetworkSelectorWithLabel } from "@/components/NetworkSelector/NetworkSelectorWithLabel";
import { FileUploader } from "@/components/inputs/fileUploader";
import { SpacerColumn } from "@/components/spacer";
import { NetworkFeature } from "@/networks";
import { TextInputLaunchpad } from "@/screens/Launchpad/components/inputs/TextInputLaunchpad";
import { patternOnlyUrl } from "@/utils/formRules";
import { IMAGE_MIME_TYPES } from "@/utils/mime";
import { neutral77, primaryColor } from "@/utils/style/colors";
import { fontSemibold14, fontSemibold28 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const LaunchpadBasic: React.FC = () => {
  const collectionForm = useFormContext<CollectionFormValues>();

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

        <TextInputLaunchpad<CollectionFormValues>
          label="Name"
          placeHolder="My Awesome Collection"
          name="name"
          control={collectionForm.control}
        />

        <TextInputLaunchpad<CollectionFormValues>
          label="Description"
          placeHolder="My Awesome Collection Description"
          name="description"
          control={collectionForm.control}
        />

        <TextInputLaunchpad<CollectionFormValues>
          label="Symbol"
          placeHolder="Symbol"
          name="symbol"
          control={collectionForm.control}
        />

        <FileUploader
          label="Cover Image"
          style={{
            marginBottom: layout.spacing_x2,
          }}
          onUpload={(files) => {
            collectionForm.setValue("coverImage", files[0]);
          }}
          mimeTypes={IMAGE_MIME_TYPES}
          required
        />

        <TextInputLaunchpad<CollectionFormValues>
          label="External Link"
          placeHolder="https://collection..."
          name="externalLink"
          control={collectionForm.control}
          rules={{ pattern: patternOnlyUrl }}
        />

        <NetworkSelectorWithLabel
          forceNetworkFeatures={[NetworkFeature.NFTLaunchpad]}
          style={{ marginBottom: layout.spacing_x3 }}
          label="Which network is your project on?"
        />
      </View>
    </View>
  );
};

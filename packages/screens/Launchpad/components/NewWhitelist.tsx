import React from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { View } from "react-native";

import {
  CreateCollectionFormValues,
  CreateCollectionWhitelist,
} from "../CreateCollection.type";

import { BrandText } from "@/components/BrandText";
import { SelectFileUploader } from "@/components/selectFileUploader";
import { Separator } from "@/components/separators/Separator";
import { SpacerColumn } from "@/components/spacer";
import { TextInputLaunchpadRequired } from "@/screens/Launchpad/components/inputs/TextInputLaunchpadRequired";
import { IMAGE_MIME_TYPES } from "@/utils/mime";
import { ARTICLE_THUMBNAIL_IMAGE_MAX_HEIGHT } from "@/utils/social-feed";
import { neutral55, neutral77 } from "@/utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold20,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { LocalFileData } from "@/utils/types/files";

export const NewWhitelist: React.FC<{
  createCollectionForm: UseFormReturn<CreateCollectionFormValues>;
}> = ({ createCollectionForm }) => {
  const { control } = useForm<CreateCollectionWhitelist>({
    mode: "onBlur",
  });

  const onUploadWhitelistFile = (files: LocalFileData[]) => {
    // TODO: Parse addresses from the TXT file and createCollectionForm.setValue("whitelistAddresses", blabla)
  };

  return (
    <View style={{ maxWidth: 416 }}>
      <SpacerColumn size={2} />
      <BrandText style={fontSemibold20}>Whitelist Minting Details</BrandText>
      <SpacerColumn size={1} />
      <BrandText style={[fontSemibold14, { color: neutral77 }]}>
        Information about your minting settings
      </BrandText>
      <SpacerColumn size={2} />

      <TextInputLaunchpadRequired<CreateCollectionWhitelist>
        label="Unit Price "
        placeHolder="0"
        name="unitPrice"
        sublabel={
          <View>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              Token price for whitelisted addressess (min. 25 TORI)
            </BrandText>
          </View>
        }
        control={control}
      />

      <TextInputLaunchpadRequired<CreateCollectionWhitelist>
        label="Per Address Limit"
        placeHolder="0"
        name="perAddressLimit"
        sublabel={
          <View>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              Maximum number of tokens per whitelisted address
            </BrandText>
          </View>
        }
        control={control}
      />

      <TextInputLaunchpadRequired<CreateCollectionWhitelist>
        label="Start Time "
        placeHolder="0"
        name="startTime"
        sublabel={
          <View>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              Start time for minting tokens to whitelisted addresses
            </BrandText>
          </View>
        }
        control={control}
      />

      <TextInputLaunchpadRequired<CreateCollectionWhitelist>
        label="End Time "
        placeHolder="0"
        name="endTime"
        sublabel={
          <View>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              End time for minting tokens to whitelisted addresses
            </BrandText>
          </View>
        }
        control={control}
      />

      <Separator />
      <SpacerColumn size={2} />
      <BrandText style={fontSemibold20}>Whitelist File</BrandText>
      <SpacerColumn size={1} />
      <BrandText style={[fontSemibold14, { color: neutral77 }]}>
        TXT file that contains the whitelisted addresses
      </BrandText>
      <SpacerColumn size={2} />

      <SelectFileUploader
        label="Select file"
        fileHeight={ARTICLE_THUMBNAIL_IMAGE_MAX_HEIGHT}
        isImageCover
        style={{
          marginBottom: layout.spacing_x2,
          width: 416,
        }}
        containerHeight={48}
        onUpload={onUploadWhitelistFile}
        mimeTypes={IMAGE_MIME_TYPES}
      />
    </View>
  );
};

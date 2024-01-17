import React from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";

import { TextInputLaunchpadNewWhitelistValues } from "./inputs/TextInputLaunchpadNewWhitelistValues";
import { BrandText } from "../../../components/BrandText";
import { SelectFileUploader } from "../../../components/selectFileUploader";
import { Separator } from "../../../components/separators/Separator";
import { SpacerColumn } from "../../../components/spacer";
import { IMAGE_MIME_TYPES } from "../../../utils/mime";
import { ARTICLE_THUMBNAIL_IMAGE_MAX_HEIGHT } from "../../../utils/social-feed";
import { neutral55, neutral77 } from "../../../utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold20,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { NewWhitelistDetailsFormValues } from "../CreateCollection.type";

export const NewWhitelist: React.FC = () => {
  const { control } = useForm<NewWhitelistDetailsFormValues>({
    defaultValues: {
      unitPrice: "",
      memberLimit: "",
      perAddresaLimit: "",
      startTime: "",
      endTime: "",
    },
    mode: "onBlur",
  });

  return (
    <View style={{ maxWidth: 416 }}>
      <SpacerColumn size={2} />
      <BrandText style={fontSemibold20}>Whitelist Minting Details</BrandText>
      <SpacerColumn size={1} />
      <BrandText style={[fontSemibold14, { color: neutral77 }]}>
        Information about your minting settings
      </BrandText>
      <SpacerColumn size={2} />
      <TextInputLaunchpadNewWhitelistValues
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

      <TextInputLaunchpadNewWhitelistValues
        label="Member Limit "
        placeHolder="0"
        name="memberLimit"
        sublabel={
          <View>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              Maximum number of whitelisted addresses
            </BrandText>
          </View>
        }
        control={control}
      />

      <TextInputLaunchpadNewWhitelistValues
        label="Per Address Limit"
        placeHolder="0"
        name="perAddresaLimit"
        sublabel={
          <View>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              Maximum number of tokens per whitelisted address
            </BrandText>
          </View>
        }
        control={control}
      />

      <TextInputLaunchpadNewWhitelistValues
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

      <TextInputLaunchpadNewWhitelistValues
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
          marginVertical: layout.spacing_x3,
          width: 416,
        }}
        onUpload={(files) => {}}
        mimeTypes={IMAGE_MIME_TYPES}
      />
    </View>
  );
};

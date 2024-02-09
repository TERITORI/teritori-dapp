import React from "react";
import { useForm } from "react-hook-form";
import { View, TouchableOpacity } from "react-native";

import trashSVG from "./../../../../../assets/icons/trash.svg";
import { layout } from "../../../../utils/style/layout";
import { TextInputSubscriptionDuration } from "../inputs/TextInputSubscriptionDuration";
import { TextInputSubscriptionMultiline } from "../inputs/TextInputSubscriptionMultiline";
import { TextInputSubscriptionPrice } from "../inputs/TextInputSubscriptionPrice";
import { MintUploader } from "../mintUploader/mintUploader.web";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { IMAGE_MIME_TYPES } from "@/utils/mime";
import {
  ARTICLE_THUMBNAIL_IMAGE_MAX_HEIGHT,
  ARTICLE_THUMBNAIL_IMAGE_MAX_WIDTH,
} from "@/utils/social-feed";
import { errorColor } from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { LocalFileData } from "@/utils/types/files";

interface AccordionBottomProps {
  image: string;
  setFiles: (files: LocalFileData[]) => void;
  onRemoveItem: () => void;
}

interface SubscriptionFormValues {
  title: string;
  price: string;
  duration: string;
  description: string;
}

export const AccordionBottomComponent = ({
  onRemoveItem,
  setFiles,
  image,
}: AccordionBottomProps) => {
  const { control } = useForm<SubscriptionFormValues>({
    defaultValues: {
      title: "",
      price: "",
      duration: "",
      description: "",
    },
    mode: "onBlur",
  });

  return (
    <>
      <MintUploader
        style={{
          marginTop: layout.spacing_x3,
        }}
        fileImageStyle={{
          objectFit: "cover",
          height: ARTICLE_THUMBNAIL_IMAGE_MAX_HEIGHT,
          maxWidth: ARTICLE_THUMBNAIL_IMAGE_MAX_WIDTH,
        }}
        onUpload={(files) =>
          files.length > 0 ? setFiles([files?.[0]]) : setFiles([])
        }
        defaultFile={image}
        mimeTypes={IMAGE_MIME_TYPES}
      />

      <SpacerColumn size={1} />

      <TextInputSubscriptionPrice<SubscriptionFormValues>
        label="Price"
        placeHolder="9.99"
        name="price"
        control={control}
      />
      <TextInputSubscriptionDuration<SubscriptionFormValues>
        label="Tier duration"
        placeHolder="Type tier duration here"
        name="duration"
        control={control}
      />
      <TextInputSubscriptionMultiline<SubscriptionFormValues>
        label="Tier description"
        placeHolder="Type tier description here"
        name="description"
        control={control}
      />
      <View
        style={{
          marginBottom: layout.spacing_x1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            height: 32,
            width: 126,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: errorColor,
          }}
          onPress={() => {
            onRemoveItem();
          }}
        >
          <SVG source={trashSVG} width={16} height={16} />
          <SpacerRow size={1} />
          <BrandText
            style={[
              fontSemibold14,
              { color: errorColor, lineHeight: layout.spacing_x2 },
            ]}
          >
            Remove tier
          </BrandText>
        </TouchableOpacity>
      </View>
    </>
  );
};

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { View, Image, TouchableOpacity } from "react-native";

import chevronDownSVG from "./../../../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "./../../../../../assets/icons/chevron-up.svg";
import trashSVG from "./../../../../../assets/icons/trash.svg";
import { layout } from "../../../../utils/style/layout";
import { TextInputSubscription } from "../inputs/TextInputSubscription";
import { TextInputSubscriptionDuration } from "../inputs/TextInputSubscriptionDuration";
import { TextInputSubscriptionMultiline } from "../inputs/TextInputSubscriptionMultiline";
import { TextInputSubscriptionPrice } from "../inputs/TextInputSubscriptionPrice";
import { MintUploader } from "../mintUploader/mintUploader.web";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { PrimaryBox } from "@/components/boxes/PrimaryBox";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { IMAGE_MIME_TYPES } from "@/utils/mime";
import {
  ARTICLE_THUMBNAIL_IMAGE_MAX_HEIGHT,
  ARTICLE_THUMBNAIL_IMAGE_MAX_WIDTH,
} from "@/utils/social-feed";
import {
  errorColor,
  neutral22,
  neutral33,
  secondaryColor,
} from "@/utils/style/colors";
import { fontSemibold14, fontSemibold16 } from "@/utils/style/fonts";
import { LocalFileData } from "@/utils/types/files";

interface AccordionProps {
  onRemoveItem: () => void;
}

interface SubscriptionFormValues {
  title: string;
  price: string;
  duration: string;
  description: string;
}

export const AccordionComponent = ({ onRemoveItem }: AccordionProps) => {
  const [isopen, setIsopen] = useState(false);
  const [file, setFile] = useState<LocalFileData[]>([]);

  const { control, watch } = useForm<SubscriptionFormValues>({
    defaultValues: {
      title: "",
      price: "",
      duration: "",
      description: "",
    },
    mode: "onBlur",
  });
  return (
    <PrimaryBox
      style={{
        borderColor: neutral33,
        backgroundColor: neutral22,
        borderWidth: 1,
        margin: layout.spacing_x1,
        padding: layout.spacing_x1,
      }}
    >
      <TouchableOpacity
        style={{ flexDirection: "row", justifyContent: "space-between" }}
        onPress={() => {
          setIsopen(!isopen);
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={{
              uri:
                file.length > 0
                  ? URL.createObjectURL(file[0].file)
                  : "https://imgproxy.tools.teritori.com/insecure/width:136/height:136/plain/ipfs%3A%2F%2Fbafybeihn5k3lskhj5xysdplt7eqw2vehzngbu2zrs7ctfqv77nkzygik6q%2Fcollection-image.gif",
            }}
            style={{
              height: 48,
              width: 48,
              borderRadius: 8,
            }}
          />
          <BrandText
            style={[
              fontSemibold16,
              { color: secondaryColor, marginLeft: layout.spacing_x1 },
            ]}
          >
            {watch("title")}
          </BrandText>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <SVG
            source={isopen ? chevronUpSVG : chevronDownSVG}
            width={16}
            height={16}
            color={secondaryColor}
          />
        </View>
      </TouchableOpacity>

      {isopen && (
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
            onUpload={(files) => setFile([files?.[0]])}
            mimeTypes={IMAGE_MIME_TYPES}
          />
          <SpacerColumn size={1} />
          <TextInputSubscription<SubscriptionFormValues>
            label="Title"
            placeHolder="Type title here"
            name="title"
            control={control}
          />
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
      )}
    </PrimaryBox>
  );
};

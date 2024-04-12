import React from "react";
import { UseFieldArrayUpdate, useFormContext } from "react-hook-form";
import { View } from "react-native";

import ModalBase from "../../../../components/modals/ModalBase";
import {
  CollectionAssetsMetadataFormValues,
  CollectionFormValues,
} from "../../../../utils/types/launchpad";

import { BrandText } from "@/components/BrandText";
import { OptimizedImage } from "@/components/OptimizedImage";
import { PrimaryBox } from "@/components/boxes/PrimaryBox";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { Separator } from "@/components/separators/Separator";
import { TextInputLaunchpad } from "@/screens/Launchpad/components/inputs/TextInputLaunchpad";
import { neutral77, secondaryColor } from "@/utils/style/colors";
import { fontSemibold16, fontSemibold20 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const MetadataUpdateModal: React.FC<{
  onClose: () => void;
  isVisible: boolean;
  elem: CollectionAssetsMetadataFormValues;
  elemIndex: number;
  update: UseFieldArrayUpdate<CollectionFormValues, "assetsMetadatas">;
}> = ({ onClose, isVisible, elem, elemIndex }) => {
  const collectionForm = useFormContext<CollectionFormValues>();
  const namePath = `assetsMetadatas.${elemIndex}.name` as const;
  const descriptionPath = `assetsMetadatas.${elemIndex}.description` as const;
  const externalUrlPath = `assetsMetadatas.${elemIndex}.externalUrl` as const;
  const youtubeUrlPath = `assetsMetadatas.${elemIndex}.youtubeUrl` as const;
  const attributesPath = `assetsMetadatas.${elemIndex}.attributes` as const;

  return (
    <ModalBase
      visible={isVisible}
      onClose={onClose}
      width={480}
      labelComponent={
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <PrimaryBox
            style={{
              width: 56,
              height: 56,
              borderColor: neutral77,
            }}
          >
            {elem.image && (
              <OptimizedImage
                sourceURI={URL.createObjectURL(elem.image.file)}
                style={{
                  height: 54,
                  width: 54,
                  borderRadius: 8,
                }}
                width={54}
                height={54}
              />
            )}
          </PrimaryBox>
          <View style={{ marginLeft: layout.spacing_x2 }}>
            <BrandText style={[fontSemibold20, { color: secondaryColor }]}>
              Update Metadata #{elemIndex + 1}
            </BrandText>
            <BrandText
              style={[fontSemibold16, { color: neutral77, width: 300 }]}
              numberOfLines={2}
            >
              Asset filename: {elem.image?.fileName}
            </BrandText>
          </View>
        </View>
      }
      hideMainSeparator
      childrenBottom={
        <View style={{ width: "100%" }}>
          <Separator />
          <View
            style={{
              justifyContent: "flex-end",
              alignItems: "flex-end",
              flex: 1,
              width: "100%",
              paddingRight: layout.spacing_x2,
            }}
          >
            <PrimaryButton
              size="XS"
              text="Update Metadata"
              boxStyle={{
                marginVertical: 20,
              }}
              width={173}
              loader
              onPress={onClose}
            />
          </View>
        </View>
      }
    >
      <View
        style={{
          alignItems: "center",
          width: 440,
          marginBottom: layout.spacing_x1,
        }}
      >
        <Separator style={{ marginBottom: layout.spacing_x3 }} />

        <TextInputLaunchpad
          name={namePath}
          label="Name"
          control={collectionForm.control}
          // FIXME: The value is not get from collectionForm. Don't know why. So I have to set value={elem.name}
          value={elem.name}
          placeHolder="Token name"
        />

        <TextInputLaunchpad<CollectionFormValues>
          name={descriptionPath}
          label="Description"
          control={collectionForm.control}
          value={elem.description}
          placeHolder="Token description"
        />

        <TextInputLaunchpad<CollectionFormValues>
          name={externalUrlPath}
          label="External URL"
          control={collectionForm.control}
          value={elem.externalUrl}
          placeHolder="https://"
        />

        <TextInputLaunchpad<CollectionFormValues>
          name={youtubeUrlPath}
          label="Youtube URL"
          control={collectionForm.control}
          value={elem.youtubeUrl}
          placeHolder="https://"
        />

        {/*TODO: Attributes selection ?*/}
        <TextInputLaunchpad<CollectionFormValues>
          name={attributesPath}
          label="Attributes"
          control={collectionForm.control}
          placeHolder="Enter trait types and values"
        />
      </View>
    </ModalBase>
  );
};

import React from "react";
import { useFormContext } from "react-hook-form";
import { View } from "react-native";

import ModalBase from "../../../../../../components/modals/ModalBase";
import {
  CollectionAssetsMetadataFormValues,
  CollectionAssetsMetadatasFormValues,
} from "../../../../../../utils/types/launchpad";

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
}> = ({ onClose, isVisible, elem, elemIndex }) => {
  const assetsMetadatasForm =
    useFormContext<CollectionAssetsMetadatasFormValues>();
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
                sourceURI={elem.image.url}
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
              Metadata #{elemIndex + 1}
            </BrandText>
            <BrandText
              style={[fontSemibold16, { color: neutral77, width: 300 }]}
              numberOfLines={2}
            >
              File name: {elem.image?.fileName}
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
              text="Close"
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

        <TextInputLaunchpad<CollectionAssetsMetadatasFormValues>
          name={namePath}
          label="Name"
          form={assetsMetadatasForm}
          placeHolder="Token name"
          disabled
        />

        <TextInputLaunchpad<CollectionAssetsMetadatasFormValues>
          name={descriptionPath}
          label="Description"
          form={assetsMetadatasForm}
          placeHolder="Token description"
          required={false}
          disabled
        />

        <TextInputLaunchpad<CollectionAssetsMetadatasFormValues>
          name={externalUrlPath}
          label="External URL"
          form={assetsMetadatasForm}
          placeHolder="https://"
          required={false}
          disabled
        />

        <TextInputLaunchpad<CollectionAssetsMetadatasFormValues>
          name={youtubeUrlPath}
          label="Youtube URL"
          form={assetsMetadatasForm}
          placeHolder="https://"
          required={false}
          disabled
        />

        {/*TODO: Attributes selection ?*/}
        <TextInputLaunchpad<CollectionAssetsMetadatasFormValues>
          name={attributesPath}
          label="Attributes"
          form={assetsMetadatasForm}
          placeHolder="Enter trait types and values"
          disabled
        />
      </View>
    </ModalBase>
  );
};

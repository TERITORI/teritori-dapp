import React from "react";
import { useForm } from "react-hook-form";
import { Image, View } from "react-native";

import ModalBase from "../../../../components/modals/ModalBase";
import { NewMetadataDetailsFormValues } from "../../../../utils/types/launchpad";

import { BrandText } from "@/components/BrandText";
import { PrimaryBox } from "@/components/boxes/PrimaryBox";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { Separator } from "@/components/separators/Separator";
import { TextInputLaunchpad } from "@/screens/Launchpad/components/inputs/TextInputLaunchpad";
import { neutral77, secondaryColor } from "@/utils/style/colors";
import { fontSemibold16, fontSemibold20 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { LocalFileData } from "@/utils/types/files";

export const MetadataUpdateModal: React.FC<{
  onClose: () => void;
  isVisible: boolean;
  item: LocalFileData;
}> = ({ onClose, isVisible, item }) => {
  const { control } = useForm<NewMetadataDetailsFormValues>({
    defaultValues: {
      name: "",
      description: "",
      externalURL: "",
      youtubeURL: "",
      attributes: "",
    },
    mode: "all",
  });

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
            <Image
              source={{ uri: URL.createObjectURL(item.file) }}
              style={{
                height: 54,
                width: 54,
                borderRadius: 8,
              }}
            />
          </PrimaryBox>
          <View style={{ marginLeft: layout.spacing_x2 }}>
            <BrandText style={[fontSemibold20, { color: secondaryColor }]}>
              Update Metadata
            </BrandText>
            <BrandText
              style={[fontSemibold16, { color: neutral77, width: 300 }]}
              numberOfLines={2}
            >
              Asset filename: {item?.fileName}
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

        <TextInputLaunchpad<NewMetadataDetailsFormValues>
          name="name"
          label="Name"
          control={control}
          placeHolder="Token name"
        />

        <TextInputLaunchpad<NewMetadataDetailsFormValues>
          name="description"
          label="Description"
          control={control}
          placeHolder="Token description"
        />

        <TextInputLaunchpad<NewMetadataDetailsFormValues>
          name="externalURL"
          label="External URL"
          control={control}
          placeHolder="https://"
        />

        <TextInputLaunchpad<NewMetadataDetailsFormValues>
          name="youtubeURL"
          label="Youtube URL"
          control={control}
          placeHolder="https://"
        />

        <TextInputLaunchpad<NewMetadataDetailsFormValues>
          name="attributes"
          label="Attributes"
          control={control}
          placeHolder="Enter trait types and values"
        />
      </View>
    </ModalBase>
  );
};

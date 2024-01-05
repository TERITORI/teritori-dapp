import React from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";

import { NewMetadataDetailsFormValues } from "../../../screens/Launchpad/CreateCollection.type";
import { neutral77, secondaryColor } from "../../../utils/style/colors";
import { fontSemibold16, fontSemibold20 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { LocalFileData } from "../../../utils/types/files";
import { BrandText } from "../../BrandText";
import { Box } from "../../boxes/Box";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { TextInputCustom } from "../../inputs/TextInputCustom";
import { Separator } from "../../separators/Separator";
import ModalBase from "../ModalBase";

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
    mode: "onBlur",
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
          <Box
            style={{
              width: 56,
              height: 56,
              borderWidth: 1,
            }}
          >
            <img
              src={URL.createObjectURL(item?.file)}
              style={{
                height: 56,
                width: 56,
              }}
              alt="Uploaded file"
            />
          </Box>
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
              size="M"
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

        <TextInputCustom<NewMetadataDetailsFormValues>
          name="name"
          label="Name"
          control={control}
          placeHolder="Token name"
          containerStyle={{ marginBottom: layout.spacing_x1_5, width: "100%" }}
          variant="labelOutside"
        />
        <TextInputCustom<NewMetadataDetailsFormValues>
          name="description"
          label="Description"
          control={control}
          placeHolder="Token description"
          containerStyle={{ marginBottom: layout.spacing_x1_5, width: "100%" }}
          variant="labelOutside"
        />
        <TextInputCustom<NewMetadataDetailsFormValues>
          name="externalURL"
          label="External URL"
          control={control}
          placeHolder="https://"
          containerStyle={{ marginBottom: layout.spacing_x1_5, width: "100%" }}
          variant="labelOutside"
        />
        <TextInputCustom<NewMetadataDetailsFormValues>
          name="youtubeURL"
          label="COMMENT ?"
          control={control}
          placeHolder="https://"
          containerStyle={{ marginBottom: layout.spacing_x1_5, width: "100%" }}
          variant="labelOutside"
        />
        <TextInputCustom<NewMetadataDetailsFormValues>
          name="attributes"
          label="Attributes"
          control={control}
          placeHolder="Enter trait types and values"
          containerStyle={{ marginBottom: layout.spacing_x1_5, width: "100%" }}
          variant="labelOutside"
        />
      </View>
    </ModalBase>
  );
};

import React, { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { SafeAreaView, TouchableOpacity, View } from "react-native";

import { MetadataUpdateModal } from "./MetadataUpdateModal";
import { FileUploaderSmall } from "../../../../../../components/inputs/fileUploaderSmall";
import { CollectionFormValues } from "../../../../../../utils/types/launchpad";

import trashSVG from "@/assets/icons/trash.svg";
import { BrandText } from "@/components/BrandText";
import { SelectedFilesPreview } from "@/components/FilePreview/SelectedFilesPreview/SelectedFilesPreview";
import { SVG } from "@/components/SVG";
import { Separator } from "@/components/separators/Separator";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { useIsMobile } from "@/hooks/useIsMobile";
import { IMAGE_MIME_TYPES } from "@/utils/mime";
import { errorColor, neutral33 } from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { LocalFileData } from "@/utils/types/files";

export const AssetsTab: React.FC = () => {
  const isMobile = useIsMobile();

  const [selectedElemIndex, setSelectedElemIndex] = useState<number>();
  const collectionForm = useFormContext<CollectionFormValues>();
  const { fields, remove, append, update, replace } = useFieldArray({
    control: collectionForm.control,
    name: "assetsMetadatas",
  });
  const [medataUpdateModalVisible, setMedataUpdateModalVisible] =
    useState(false);
  const selectedElem = fields.find(
    (metadata, index) => index === selectedElemIndex,
  );
  return (
    <SafeAreaView
      style={{
        width: "100%",
      }}
    >
      <View
        style={{
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        {/* ===== Left container */}
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            minWidth: 300,
          }}
        >
          <View
            style={{
              justifyContent: "flex-start",
              alignItems: "center",
              width: "100%",
              padding: layout.spacing_x2,
            }}
          >
            <View
              style={{
                width: "100%",
              }}
            >
              {/*TODO: What's this field ?*/}
              {/*<TextInputLaunchpad<CollectionFormValues>*/}
              {/*  label="NFT.Storage API Key"*/}
              {/*  placeHolder="My Awesome Collection"*/}
              {/*  name="nftApiKey"*/}
              {/*  control={control}*/}
              {/*  rules={{required: false}}*/}
              {/*/>*/}

              <FileUploaderSmall
                label="Assets selection"
                nbAddedFiles={fields.length}
                onUpload={(files: LocalFileData[]) => {
                  files.forEach((file) => {
                    append({
                      image: file,
                      name: "",
                      description: "",
                      externalUrl: "",
                      youtubeUrl: "",
                      attributes: "",
                    });
                  });
                }}
                mimeTypes={IMAGE_MIME_TYPES}
                multiple
              />

              {!!fields.length && (
                <>
                  <SpacerColumn size={2} />
                  <Separator />
                  <SpacerColumn size={2} />
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 32,
                      paddingHorizontal: layout.spacing_x2,
                      borderRadius: 999,
                      borderWidth: 1,
                      borderColor: errorColor,
                      marginBottom: layout.spacing_x1,
                    }}
                    onPress={() => replace([])}
                  >
                    <SVG source={trashSVG} width={16} height={16} />
                    <SpacerRow size={1} />
                    <BrandText
                      style={[
                        fontSemibold14,
                        { color: errorColor, lineHeight: layout.spacing_x2 },
                      ]}
                    >
                      Remove all assets
                    </BrandText>
                  </TouchableOpacity>
                </>
              )}

              {/*TODO: metadata file ? */}
              {/*<SelectFileUploader*/}
              {/*  label="Metadata selection"*/}
              {/*  style={{*/}
              {/*    marginVertical: layout.spacing_x3,*/}
              {/*    width: 416,*/}
              {/*  }}*/}
              {/*  containerHeight={100}*/}
              {/*  multiple*/}
              {/*  onUpload={(files) => {}}*/}
              {/*  mimeTypes={IMAGE_MIME_TYPES}*/}
              {/*  isRequired={false}*/}
              {/*/>*/}
            </View>
          </View>
        </View>

        {/* ---- Separator*/}
        <View
          style={[
            {
              backgroundColor: neutral33,
              margin: isMobile ? 0 : layout.spacing_x2,
            },
            isMobile ? { height: 1 } : { width: 1 },
          ]}
        />

        {/* ===== Right container */}
        <View
          style={{
            justifyContent: "flex-start",
            flex: 1,
            margin: layout.spacing_x2,
          }}
        >
          <SelectedFilesPreview
            files={fields.map((metadata) => metadata.image!)}
            onPressItem={(file, itemIndex) => {
              setMedataUpdateModalVisible(true);
              setSelectedElemIndex(itemIndex);
            }}
            onPressDeleteItem={(itemIndex) => remove(itemIndex)}
          />
        </View>

        {selectedElem && selectedElemIndex !== undefined && (
          <MetadataUpdateModal
            onClose={() => setMedataUpdateModalVisible(false)}
            isVisible={medataUpdateModalVisible}
            elem={selectedElem}
            elemIndex={selectedElemIndex}
            update={update}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

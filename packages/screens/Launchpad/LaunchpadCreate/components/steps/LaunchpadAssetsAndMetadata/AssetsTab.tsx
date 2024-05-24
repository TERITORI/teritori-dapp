import { parse, ParseResult } from "papaparse";
import React, { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { SafeAreaView, TouchableOpacity, View } from "react-native";

import { MetadataUpdateModal } from "./MetadataUpdateModal";
import { FileUploaderSmall } from "../../../../../../components/inputs/fileUploaderSmall";
import {
  CollectionAssetsMetadataFormValues,
  CollectionFormValues,
} from "../../../../../../utils/types/launchpad";

import trashSVG from "@/assets/icons/trash.svg";
import { BrandText } from "@/components/BrandText";
import { SelectedFilesPreview } from "@/components/FilePreview/SelectedFilesPreview/SelectedFilesPreview";
import { SVG } from "@/components/SVG";
import { Separator } from "@/components/separators/Separator";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { useIsMobile } from "@/hooks/useIsMobile";
import { IMAGE_MIME_TYPES, TXT_CSV_MIME_TYPES } from "@/utils/mime";
import { errorColor, neutral33 } from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { pluralOrNot } from "@/utils/text";
import { LocalFileData } from "@/utils/types/files";

const fileNameColIndex = 0;
const nameColIndex = 1;
const descriptionColIndex = 2;
const externalURLColIndex = 3;
const youtubeURLColIndex = 4;
const attributesColIndex = 5;

export const AssetsTab: React.FC = () => {
  const isMobile = useIsMobile();
  const { setToast } = useFeedbacks();
  const [selectedElemIndex, setSelectedElemIndex] = useState<number>();
  const collectionForm = useFormContext<CollectionFormValues>();
  const { fields, remove } = useFieldArray({
    control: collectionForm.control,
    name: "assetsMetadatas",
  });
  const [mappingFileParseResults, setMappingFileParseResults] =
    useState<ParseResult<string[]>>();
  const [medataUpdateModalVisible, setMedataUpdateModalVisible] =
    useState(false);
  const selectedElem = fields.find(
    (metadata, index) => index === selectedElemIndex,
  );

  const onUploadMappingDataFile = async (files: LocalFileData[]) => {
    collectionForm.setValue("assetsMetadatas", []);

    // Controls CSV headings present on the first row.
    try {
      await parse<string[]>(files[0].file, {
        complete: (parseResults) => {
          if (
            parseResults.data[0][fileNameColIndex] !== "fileName" ||
            parseResults.data[0][nameColIndex] !== "name" ||
            parseResults.data[0][descriptionColIndex] !== "description" ||
            parseResults.data[0][externalURLColIndex] !== "externalURL" ||
            parseResults.data[0][youtubeURLColIndex] !== "youtubeURL" ||
            parseResults.data[0][attributesColIndex] !== "attributes"
          ) {
            setMappingFileParseResults(undefined);
            console.error(
              "Please verify the headings on the first row.\nCheck the description for more information.",
            );
            setToast({
              title: "Invalid mapping file",
              message:
                "Please verify the headings on the first row.\nCheck the description for more information.",
              mode: "normal",
              type: "error",
            });
          } else {
            setMappingFileParseResults(parseResults);
          }
        },
      });
    } catch (e) {
      setMappingFileParseResults(undefined);
      console.error(`${e}`);
      setToast({
        title: "Error parsing " + files[0].file.name,
        message: `${e}`,
        mode: "normal",
        type: "error",
      });
    }
  };

  const onUploadImages = (images: LocalFileData[]) => {
    if (!mappingFileParseResults) return;
    collectionForm.setValue("assetsMetadatas", []);

    const dataRows = mappingFileParseResults.data;
    const mappedAssets: CollectionAssetsMetadataFormValues[] = [];

    //The rows order in the CSV determines the assets order.
    dataRows.forEach((dataRow, dataRowIndex) => {
      if (dataRowIndex === 0) return;

      images.forEach((image) => {
        if (dataRow[fileNameColIndex] !== image.file.name) return;

        mappedAssets.push({
          image,
          // Empty values are valid
          name: dataRow[nameColIndex],
          description: dataRow[descriptionColIndex],
          externalUrl: dataRow[externalURLColIndex],
          youtubeUrl: dataRow[youtubeURLColIndex],
          attributes: dataRow[attributesColIndex],
        });
      });
    });
    collectionForm.setValue("assetsMetadatas", mappedAssets);

    if (mappedAssets.length < images.length) {
      const nbIgnoredImages = images.length - mappedAssets.length;
      const message = `${nbIgnoredImages} added ${pluralOrNot("image", nbIgnoredImages)} ${pluralOrNot("is", nbIgnoredImages)} not expected in the mapping file and has been ignored.\nCheck the description for more information.`;
      console.warn(message);
      setToast({
        title: "Unknown images",
        message,
        mode: "normal",
        type: "warning",
      });
    }
    if (
      dataRows.length - 1 > //First row is headings, so we do -1
      mappedAssets.length
    ) {
      console.log("dataRows.length - 1", dataRows.length - 1);
      console.log("mappedAssets.length", mappedAssets.length);
      const nbMissingImages = dataRows.length - 1 - mappedAssets.length;
      const message = `${nbMissingImages} added ${pluralOrNot("image", nbMissingImages)} expected in the mapping file ${pluralOrNot("is", nbMissingImages)} missing.\nCheck the description for more information.`;
      console.warn(message);
      setToast({
        title: "Missing images",
        message,
        mode: "normal",
        type: "warning",
      });
    }
  };

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
            width: 300,
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
              {/*TODO: Useless since the user can already provide a key in Settings ?*/}
              {/*<TextInputLaunchpad<CollectionFormValues>*/}
              {/*  label="NFT.Storage API Key"*/}
              {/*  placeHolder="My Awesome Collection"*/}
              {/*  name="nftApiKey"*/}
              {/*  control={control}*/}
              {/*  rules={{required: false}}*/}
              {/*/>*/}

              <FileUploaderSmall
                label="Assets data mapping file"
                filesCount={mappingFileParseResults ? 1 : 0}
                onUpload={onUploadMappingDataFile}
                mimeTypes={TXT_CSV_MIME_TYPES}
              />

              <SpacerColumn size={2} />
              <Separator />
              <SpacerColumn size={2} />

              <FileUploaderSmall
                disabled={!mappingFileParseResults}
                label="Assets images"
                filesCount={fields.length}
                onUpload={onUploadImages}
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
                      Remove all images
                    </BrandText>
                  </TouchableOpacity>
                </>
              )}
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
          />
        )}
      </View>
    </SafeAreaView>
  );
};

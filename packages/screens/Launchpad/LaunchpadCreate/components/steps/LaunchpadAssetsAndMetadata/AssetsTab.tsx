import { parse, ParseResult } from "papaparse";
import React, { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { SafeAreaView, TouchableOpacity, View } from "react-native";

import { MetadataUpdateModal } from "./MetadataUpdateModal";
import { FileUploaderSmall } from "../../../../../../components/inputs/fileUploaderSmall";
import {
  CollectionAssetsMetadataFormValues,
  CollectionAssetsMetadatasFormValues,
} from "../../../../../../utils/types/launchpad";

import crossSVG from "@/assets/icons/cross.svg";
import trashSVG from "@/assets/icons/trash.svg";
import warningTriangleSVG from "@/assets/icons/warning-triangle.svg";
import { BrandText } from "@/components/BrandText";
import { SelectedFilesPreview } from "@/components/FilePreview/SelectedFilesPreview/SelectedFilesPreview";
import { SVG } from "@/components/SVG";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { Separator } from "@/components/separators/Separator";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { useIsMobile } from "@/hooks/useIsMobile";
import { IMAGE_MIME_TYPES, TXT_CSV_MIME_TYPES } from "@/utils/mime";
import {
  errorColor,
  neutral17,
  neutral33,
  neutral77,
  warningColor,
} from "@/utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "@/utils/style/fonts";
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
  const assetsMetadatasForm =
    useFormContext<CollectionAssetsMetadatasFormValues>();
  const { fields, remove } = useFieldArray({
    control: assetsMetadatasForm.control,
    name: "assetsMetadatas",
  });
  const [mappingFileParseResults, setMappingFileParseResults] =
    useState<ParseResult<string[]>>();
  const [medataUpdateModalVisible, setMedataUpdateModalVisible] =
    useState(false);
  const selectedElem = fields.find(
    (metadata, index) => index === selectedElemIndex,
  );
  const [issues, setIssues] = useState<
    {
      title: string;
      message: string;
      type: "error" | "warning";
    }[]
  >([]);

  const onUploadMappingDataFile = async (files: LocalFileData[]) => {
    setIssues([]);
    assetsMetadatasForm.setValue("assetsMetadatas", []);

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
            const title = "Invalid mapping file";
            const message =
              "Please verify the headings on the first row.\nThe selected file is ignored.\nCheck the description for more information.";
            console.error(title + ".\n" + message);
            setIssues((issues) => [
              ...issues,
              {
                title,
                message,
                type: "error",
              },
            ]);
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
    setIssues([]);
    assetsMetadatasForm.setValue("assetsMetadatas", []);
    const dataRows = mappingFileParseResults.data;
    const mappedAssets: CollectionAssetsMetadataFormValues[] = [];
    const missingNameRows: string[][] = [];
    const missingAttributesRows: string[][] = [];

    //The rows order in the CSV determines the assets order.
    dataRows.forEach((dataRow, dataRowIndex) => {
      if (dataRowIndex === 0) return; // We ignore the first row since it's the table headings
      images.forEach((image) => {
        if (dataRow[fileNameColIndex] !== image.file.name) return;
        const asset: CollectionAssetsMetadataFormValues = {
          image,
          // Empty values are valid, except for name and attributes
          name: dataRow[nameColIndex],
          description: dataRow[descriptionColIndex],
          externalUrl: dataRow[externalURLColIndex],
          youtubeUrl: dataRow[youtubeURLColIndex],
          attributes: dataRow[attributesColIndex],
        };
        if (!dataRow[nameColIndex].trim()) {
          missingNameRows.push(dataRow);
        }
        if (!dataRow[attributesColIndex].trim()) {
          missingAttributesRows.push(dataRow);
        }
        if (dataRow[nameColIndex].trim() && dataRow[attributesColIndex].trim())
          mappedAssets.push(asset);
      });
    });
    assetsMetadatasForm.setValue("assetsMetadatas", mappedAssets);

    // ---- Handling warnings
    if (
      mappedAssets.length +
        missingNameRows.length +
        missingAttributesRows.length <
      images.length
    ) {
      const nbUnexpectedAssets =
        images.length -
        (mappedAssets.length +
          missingNameRows.length +
          missingAttributesRows.length);
      const title = `Unexpected ${pluralOrNot("asset", nbUnexpectedAssets)}`;
      const message = `${nbUnexpectedAssets} selected ${pluralOrNot("asset", nbUnexpectedAssets)} ${pluralOrNot("is", nbUnexpectedAssets)} not expected in the mapping file and has been ignored.\nCheck the description for more information.`;
      console.warn(title + ".\n" + message);
      setIssues((issues) => [
        ...issues,
        {
          title,
          message,
          type: "warning",
        },
      ]);
    }
    if (missingNameRows.length) {
      const title = `Incomplete ${pluralOrNot("asset", missingNameRows.length)}`;
      const message = `Missing "name" in ${missingNameRows.length} selected ${pluralOrNot("asset", missingNameRows.length)} that ${pluralOrNot("is", missingNameRows.length)} ignored.\nPlease complete properly the mapping file.\nCheck the description for more information.`;
      console.warn(title + ".\n" + message);
      setIssues((issues) => [
        ...issues,
        {
          title,
          message,
          type: "warning",
        },
      ]);
    }
    if (missingAttributesRows.length) {
      const title = `Incomplete ${pluralOrNot("asset", missingAttributesRows.length)}`;
      const message = `Missing "attributes" in ${missingAttributesRows.length} selected ${pluralOrNot("asset", missingAttributesRows.length)} that ${pluralOrNot("is", missingAttributesRows.length)} ignored.\nPlease complete properly the mapping file.\nCheck the description for more information.`;
      console.warn(title + ".\n" + message);
      setIssues((issues) => [
        ...issues,
        {
          title,
          message,
          type: "warning",
        },
      ]);
    }
    if (
      dataRows.length - 1 > //First row is headings, so we do -1
      mappedAssets.length
    ) {
      const nbMissingAssets = dataRows.length - 1 - mappedAssets.length;
      const title = `Missing ${pluralOrNot("asset", nbMissingAssets)}`;
      const message = `${nbMissingAssets} ${pluralOrNot("asset", nbMissingAssets)} expected in the mapping file ${pluralOrNot("is", nbMissingAssets)} missing.\nCheck the description for more information.`;
      console.warn(title + ".\n" + message);
      setIssues((issues) => [
        ...issues,
        {
          title,
          message,
          type: "warning",
        },
      ]);
    }
  };

  return (
    <SafeAreaView
      style={{
        width: "100%",
      }}
    >
      {!!issues.length && (
        <>
          <SpacerColumn size={1} />
          {issues.map((issue, index) => (
            <CustomPressable
              onPress={() =>
                setIssues((issues) => issues.filter((issue, i) => i !== index))
              }
              key={index}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: neutral17,
                padding: layout.spacing_x2,
                borderRadius: 16,
                marginBottom:
                  index !== issues.length - 1 ? layout.spacing_x1 : 0,
              }}
            >
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row" }}>
                  <SVG
                    source={warningTriangleSVG}
                    color={issue.type === "error" ? errorColor : warningColor}
                    height={16}
                    width={16}
                  />
                  <SpacerRow size={1} />
                  <BrandText
                    style={[
                      fontSemibold13,
                      {
                        color:
                          issue.type === "error" ? errorColor : warningColor,
                      },
                    ]}
                  >
                    {issue.title}
                  </BrandText>
                </View>
                <SpacerColumn size={0.5} />
                <BrandText style={[fontSemibold13, { color: neutral77 }]}>
                  {issue.message}
                </BrandText>
              </View>

              <SVG source={crossSVG} color={neutral77} height={16} width={16} />
            </CustomPressable>
          ))}
        </>
      )}

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
                    onPress={() => {
                      assetsMetadatasForm.setValue("assetsMetadatas", []);
                      setIssues([]);
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

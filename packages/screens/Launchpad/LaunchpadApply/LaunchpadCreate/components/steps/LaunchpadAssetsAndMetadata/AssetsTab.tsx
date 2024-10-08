import { parse } from "papaparse";
import React, { useRef, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { SafeAreaView, TouchableOpacity, View } from "react-native";

import { MetadataUpdateModal } from "./MetadataUpdateModal";

import crossSVG from "@/assets/icons/cross.svg";
import trashSVG from "@/assets/icons/trash.svg";
import warningTriangleSVG from "@/assets/icons/warning-triangle.svg";
import { BrandText } from "@/components/BrandText";
import { SelectedFilesPreview } from "@/components/FilePreview/SelectedFilesPreview/SelectedFilesPreview";
import { SVG } from "@/components/SVG";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { FileUploaderSmall } from "@/components/inputs/FileUploaderSmall";
import { Separator } from "@/components/separators/Separator";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { useIsMobile } from "@/hooks/useIsMobile";
import { IMAGE_MIME_TYPES, TXT_CSV_MIME_TYPES } from "@/utils/mime";
import {
  NUMBERS_COMMA_SEPARATOR_REGEXP,
  NUMBERS_REGEXP,
  URL_REGEX,
} from "@/utils/regex";
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
import {
  CollectionAssetsAttributeFormValues,
  CollectionAssetsMetadataFormValues,
  CollectionAssetsMetadatasFormValues,
} from "@/utils/types/launchpad";
import { FileUploaderSmallHandle, FileUploaderSmallProps } from "@/components/inputs/FileUploaderSmall/FileUploaderSmall.type";

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
  const [assetsMappingDataRows, setAssetsMappingDataRows] = useState<
    string[][]
  >([]);
  const [attributesMappingDataRows, setAttributesMappingDataRows] = useState<
    string[][]
  >([]);

  const attributesUploaderRef = useRef<FileUploaderSmallHandle>(null)
  const assetsUploaderRef = useRef<FileUploaderSmallHandle>(null)
  const imagesUploaderRef = useRef<FileUploaderSmallHandle>(null)

  const [metadataUpdateModalVisible, setMedataUpdateModalVisible] =
    useState(false);
  const selectedElem = fields.find((_, index) => index === selectedElemIndex);
  const [issues, setIssues] = useState<
    {
      title: string;
      message: string;
      type: "error" | "warning";
    }[]
  >([]);

  const attributesIdsSeparator = ",";
  // Assets columns
  const fileNameColIndex = 0;
  const nameColIndex = 1;
  const descriptionColIndex = 2;
  const externalURLColIndex = 3;
  const youtubeURLColIndex = 4;
  const attributesColIndex = 5;
  // Attributes (traits) columns
  const idColIndex = 0;
  const typeColIndex = 1;
  const valueColIndex = 2;

  const resetAll = () => {
    setAssetsMappingDataRows([]);
    setAttributesMappingDataRows([]);
    assetsMetadatasForm.setValue("assetsMetadatas", []);
    setIssues([]);
    attributesUploaderRef.current?.resetFiles()
    assetsUploaderRef.current?.resetFiles()
    imagesUploaderRef.current?.resetFiles()
  }

  // We ignore the first row since it's the table headings
  // We ignore unwanted empty lines from the CSV
  const cleanDataRows = (array: string[][]) =>
    array.filter(
      (dataRow, dataRowIndex) => dataRow[0] !== "" && dataRowIndex > 0,
    );
  // Converts attributes ids as string to array of ids
  const cleanAssetAttributesIds = (ids?: string) =>
    ids?.split(attributesIdsSeparator)
    .map((id) => id.trim())
    .filter((id) => NUMBERS_COMMA_SEPARATOR_REGEXP.test(id)) || []

  // On upload attributes CSV mapping file
  const onUploadAttributesMapingFile = async (files: LocalFileData[]) => {
    setIssues([]);
    assetsMetadatasForm.setValue("assetsMetadatas", []);

    try {
      await parse<string[]>(files[0].file, {
        complete: (parseResults) => {
          const attributesDataRows = parseResults.data;

          // Controls CSV headings present on the first row.
          if (
            attributesDataRows[0][idColIndex] !== "id" ||
            attributesDataRows[0][valueColIndex] !== "value" ||
            attributesDataRows[0][typeColIndex] !== "type"
          ) {
            setAttributesMappingDataRows([]);

            const title = "Invalid attributes mapping file";
            const message =
              "Please verify the headings on the first row in your attributes mapping file.\nThis file is ignored.\nCheck the description for more information.";
            console.error(title + ".\n" + message);
            setIssues((issues) => [
              ...issues,
              {
                title,
                message,
                type: "error",
              },
            ]);
            return;
          }

          // Verifying that all attributes rows have an id, name and value
          const missingIdRows: string[][] = [];
          const missingTypeRows: string[][] = [];
          const missingValueRows: string[][] = [];
          const wrongIdRows: string[][] = [];
          const rowsIndexesToRemove: number[] = [];

          // Controling attributes
          cleanDataRows(attributesDataRows).forEach((dataRow, dataRowIndex) => {
            const hasNoId = !dataRow[idColIndex]?.trim();
            const hasNoValue = !dataRow[valueColIndex]?.trim();
            const hasNoType = !dataRow[typeColIndex]?.trim();
            const hasWrongId =
              dataRow[idColIndex]?.trim() &&
              !NUMBERS_REGEXP.test(dataRow[idColIndex].trim());

            // Warning if no id in attribute (Ignore attribute)
            if (hasNoId) {
              missingIdRows.push(dataRow);
            }
            // Warning if no value in attribute (Ignore attribute)
            if (hasNoValue) {
              missingValueRows.push(dataRow);
            }
            // Warning if no type in attribute (Ignore attribute)
            if (hasNoType) {
              missingTypeRows.push(dataRow);
            }
            // Warning if id is not a digit (Ignore attribute)
            if (hasWrongId) {
              wrongIdRows.push(dataRow);
            }
            // We get the invalidated rows to remove
            if (hasNoId || hasNoValue || hasNoType || hasWrongId) {
              rowsIndexesToRemove.push(dataRowIndex);
            }
          });

          // We remove the wrong rows from parseResults.data (The assets rows)
          const result = cleanDataRows(parseResults.data).filter(
            (_, index) => !rowsIndexesToRemove.includes(index),
          );
          // Soring the final result
          setAttributesMappingDataRows(result);

          // Handling warnings
          if (missingIdRows.length) {
            const title = `Incomplete ${pluralOrNot("attribute", missingIdRows.length)}`;
            const message = `Missing "id" in ${missingIdRows.length} ${pluralOrNot("attribute", missingIdRows.length)} that ${pluralOrNot("is", missingIdRows.length)} ignored.\nPlease complete properly your attributes mapping file.\nCheck the description for more information.`;
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
          if (missingTypeRows.length) {
            const title = `Incomplete ${pluralOrNot("attribute", missingTypeRows.length)}`;
            const message = `Missing "type" in ${missingTypeRows.length} ${pluralOrNot("attribute", missingTypeRows.length)} that ${pluralOrNot("is", missingTypeRows.length)} ignored.\nPlease complete properly your attributes mapping file.\nCheck the description for more information.`;
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
          if (missingValueRows.length) {
            const title = `Incomplete ${pluralOrNot("attribute", missingValueRows.length)}`;
            const message = `Missing "value" in ${missingValueRows.length} ${pluralOrNot("attribute", missingValueRows.length)} that ${pluralOrNot("is", missingValueRows.length)} ignored.\nPlease complete properly your attributes mapping file.\nCheck the description for more information.`;
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
          if (wrongIdRows.length) {
            const title = `Wrong id`;
            const message = `${wrongIdRows.length} ${pluralOrNot("attribute", wrongIdRows.length)} contain a wrong "id" value and has beed ignored. Only a number is allwowed.\nCheck the description for more information.`;
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
        },
      });
    } catch (e) {
      setAttributesMappingDataRows([]);

      console.error(`${e}`);
      setToast({
        title: "Error parsing " + files[0].file.name,
        message: `${e}`,
        mode: "normal",
        type: "error",
      });
    }
  };

  // On upload assets CSV mapping file
  const onUploadAssetsMappingFile = async (files: LocalFileData[]) => {
    try {
      await parse<string[]>(files[0].file, {
        complete: (parseResults) => {
          const assetsDataRows = parseResults.data;
          const attributesDataRows = attributesMappingDataRows; // attributesMappingDataRows is clean here

          // Controls CSV headings present on the first row.
          if (
            assetsDataRows[0][fileNameColIndex] !== "file_name" ||
            assetsDataRows[0][nameColIndex] !== "name" ||
            assetsDataRows[0][descriptionColIndex] !== "description" ||
            assetsDataRows[0][externalURLColIndex] !== "external_url" ||
            assetsDataRows[0][youtubeURLColIndex] !== "youtube_url" ||
            assetsDataRows[0][attributesColIndex] !== "attributes"
          ) {
            setAssetsMappingDataRows([]);

            const title = "Invalid assets mapping file";
            const message =
              "Please verify the headings on the first row in your assets mapping file.This file is ignored.\nCheck the description for more information.";
            console.error(title + ".\n" + message);
            setIssues((issues) => [
              ...issues,
              {
                title,
                message,
                type: "error",
              },
            ]);
            return;
          }

          const missingNameRows: string[][] = [];
          const missingAttributesRows: string[][] = [];
          const unknownAttributesRowsInAssets: string[][] = [];
          const wrongAttributesRowsInAssets: string[][] = [];
          const wrongUrlsRowsInAssets: string[][] = [];
          const rowsIndexesToRemove: number[] = [];

          // Controling assets and attributes
          cleanDataRows(assetsDataRows).forEach(
            (assetDataRow, assetDataRowIndex) => {
              const hasNoName = !assetDataRow[nameColIndex]?.trim();
              const hasNoAttribute = !assetDataRow[attributesColIndex]?.trim();
              const hasWrongAttribute = !NUMBERS_COMMA_SEPARATOR_REGEXP.test(
                assetDataRow[attributesColIndex],
              );
              const hasWrongExternalUrl =
                assetDataRow[externalURLColIndex]?.trim() &&
                !URL_REGEX.test(assetDataRow[externalURLColIndex].trim());
              const hasWrongYoutubeUrl =
                assetDataRow[youtubeURLColIndex]?.trim() &&
                !URL_REGEX.test(assetDataRow[youtubeURLColIndex].trim());

              // Warning if no name in asset (Ignore asset)
              if (hasNoName) {
                missingNameRows.push(assetDataRow);
              }
              // Warning if no attributes in asset (Ignore asset)
              if (hasNoAttribute) {
                missingAttributesRows.push(assetDataRow);
              }
              // Else, warning if wrong attributes ids in asset. We want numbers with comma separators (Ignore asset)
              else if (hasWrongAttribute) {
                wrongAttributesRowsInAssets.push(assetDataRow);
              }
              // We get unvalidated rows to remove
              if (hasNoName || hasNoAttribute || hasWrongAttribute) {
                rowsIndexesToRemove.push(assetDataRowIndex);
              }

              // Warning if wrong urls in asset (No incidence)
              if (hasWrongExternalUrl || hasWrongYoutubeUrl) {
                wrongUrlsRowsInAssets.push(assetDataRow);
              }
              // Warning if unknow attributes ids in asset (No incidence)
              const assetAttributesIds = cleanAssetAttributesIds(assetDataRow[attributesColIndex])
                let nbIdsFound = 0;
              assetAttributesIds.forEach((id) => {
                attributesDataRows.forEach((attributeDataRow) => {
                  if (id === attributeDataRow[idColIndex]?.trim()) {
                    nbIdsFound++;
                  }
                });
              });
              if (nbIdsFound < assetAttributesIds.length) {
                unknownAttributesRowsInAssets.push(assetDataRow);
              }
            },
          );

          // We remove the wrong rows from parseResults.data (The assets rows)
          const result = cleanDataRows(assetsDataRows).filter(
            (_, index) => !rowsIndexesToRemove.includes(index),
          );
          // Storing the final results
          setAssetsMappingDataRows(result);

          // Handling warnings
          if (missingNameRows.length) {
            const title = `Incomplete ${pluralOrNot("asset", missingNameRows.length)}`;
            const message = `Missing "name" in ${missingNameRows.length} ${pluralOrNot("asset", missingNameRows.length)} that ${pluralOrNot("is", missingNameRows.length)} ignored.\nPlease complete properly your assets mapping file.\nCheck the description for more information.`;
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
            const message = `Missing "attributes" in ${missingAttributesRows.length} ${pluralOrNot("asset", missingAttributesRows.length)} that ${pluralOrNot("is", missingAttributesRows.length)} ignored.\nPlease complete properly your assets mapping file.\nCheck the description for more information.`;
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
          if (wrongAttributesRowsInAssets.length) {
            const title = `Wrong attributes`;
            const message = `${wrongAttributesRowsInAssets.length} ${pluralOrNot("asset", wrongAttributesRowsInAssets.length)} contain a wrong "attributes" value and ${pluralOrNot("is", wrongAttributesRowsInAssets.length)} ignored. Only numbers with comma separator are allwowed.\nCheck the description for more information.`;
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
          if (wrongUrlsRowsInAssets.length) {
            const title = `Wrong URLs`;
            const message = `${wrongUrlsRowsInAssets.length} ${pluralOrNot("asset", wrongUrlsRowsInAssets.length)} contain a wrong "youtube_url" or "external_url" value (No incidence).\nCheck the description for more information.`;
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
          if (unknownAttributesRowsInAssets.length) {
            const title = `Unknown attributes`;
            const message = `${unknownAttributesRowsInAssets.length} ${pluralOrNot("asset", unknownAttributesRowsInAssets.length)} contain at least one "attributes" id that doesn't exist in your attributes mapping file. (No incidence)\nCheck the description for more information.`;
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
        },
      });
    } catch (e) {
      setAssetsMappingDataRows([]);

      console.error(`${e}`);
      setToast({
        title: "Error parsing " + files[0].file.name,
        message: `${e}`,
        mode: "normal",
        type: "error",
      });
    }
  };

  // On upload images files
  const onUploadImages = (images: LocalFileData[]) => {
    if (!assetsMappingDataRows.length || !attributesMappingDataRows.length)
      return;

    const collectionAssetsMetadatas: CollectionAssetsMetadataFormValues[] = [];

    //The rows order in the CSV determines the assets order.
    assetsMappingDataRows.forEach((assetDataRow, assetDataRowIndex) => {
      images.forEach((image) => {
        if (assetDataRow[fileNameColIndex] !== image.file.name) return;
        // --- Mapping attributes
        const mappedAttributes: CollectionAssetsAttributeFormValues[] = [];
        const assetAttributesIds = [
          ...new Set(
            cleanAssetAttributesIds(assetDataRow[attributesColIndex]),
          ),
        ]; // We ignore duplicate attributes ids from assets
        assetAttributesIds.forEach((assetAttributeId) => {
          attributesMappingDataRows.forEach(
            (attributeDataRow, attributeDataRowIndex) => {
              if (attributeDataRow[idColIndex] === assetAttributeId) {
                mappedAttributes.push({
                  value: attributeDataRow[valueColIndex],
                  type: attributeDataRow[typeColIndex],
                });
              }
            },
          );
        });

        // --- Mapping assets
        const mappedAssets: CollectionAssetsMetadataFormValues = {
          image,
          name: assetDataRow[nameColIndex],
          description: assetDataRow[descriptionColIndex],
          externalUrl: assetDataRow[externalURLColIndex],
          youtubeUrl: assetDataRow[youtubeURLColIndex],
          attributes: mappedAttributes,
        };
        collectionAssetsMetadatas.push(mappedAssets);
      });
    });
    assetsMetadatasForm.setValue("assetsMetadatas", collectionAssetsMetadatas);

    // Handling warnings
    if (collectionAssetsMetadatas.length < images.length) {
      const nbUnexpectedImages =
        images.length - collectionAssetsMetadatas.length;
      const title = `Unexpected ${pluralOrNot("image", nbUnexpectedImages)}`;
      const message = `${nbUnexpectedImages} ${pluralOrNot("image", nbUnexpectedImages)} ${pluralOrNot("is", nbUnexpectedImages)} not expected in your assets mapping file and ${pluralOrNot("is", nbUnexpectedImages)} ignored.\nCheck the description for more information.`;
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

    if (assetsMappingDataRows.length > collectionAssetsMetadatas.length) {
      const nbMissingImages =
        assetsMappingDataRows.length - collectionAssetsMetadatas.length;
      const title = `Missing ${pluralOrNot("image", nbMissingImages)}`;
      const message = `${nbMissingImages} ${pluralOrNot("image", nbMissingImages)} expected in your assets mapping file ${pluralOrNot("is", nbMissingImages)} missing.\nCheck the description for more information.`;
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
              {/* Firstly: Attributes */}
              <FileUploaderSmall
                label="Attributes mapping file"
                filesCount={attributesMappingDataRows.length ? 1 : 0}
                onUpload={onUploadAttributesMapingFile}
                mimeTypes={TXT_CSV_MIME_TYPES}
                boxStyle={{ minHeight: 40 }}
                ref={assetsUploaderRef}
              />

              <SpacerColumn size={2} />

              {/* Secondly: Assets */}
              <FileUploaderSmall
                label="Assets mapping file"
                filesCount={assetsMappingDataRows.length ? 1 : 0}
                onUpload={onUploadAssetsMappingFile}
                mimeTypes={TXT_CSV_MIME_TYPES}
                boxStyle={{ minHeight: 40 }}
                disabled={!attributesMappingDataRows.length}
                ref={attributesUploaderRef}
              />

              <SpacerColumn size={2} />
              <Separator />
              <SpacerColumn size={2} />

              {/* Thirdly: Images */}
              <FileUploaderSmall
                disabled={!assetsMappingDataRows.length}
                label="Images"
                filesCount={fields.length}
                onUpload={onUploadImages}
                mimeTypes={IMAGE_MIME_TYPES}
                multiple
                ref={imagesUploaderRef}
              />

              {(!!fields.length ||
                !!assetsMappingDataRows.length ||
                !!attributesMappingDataRows.length) && (
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
                    onPress={resetAll}
                  >
                    <SVG source={trashSVG} width={16} height={16} />
                    <SpacerRow size={1} />
                    <BrandText
                      style={[
                        fontSemibold14,
                        { color: errorColor, lineHeight: layout.spacing_x2 },
                      ]}
                    >
                      Remove all files
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
            files={fields.map(
              (metadata: CollectionAssetsMetadataFormValues) => metadata.image!,
            )}
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
            isVisible={metadataUpdateModalVisible}
            elem={selectedElem}
            elemIndex={selectedElemIndex}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

import { parse } from "papaparse";
import pluralize from "pluralize";
import { FC, useEffect, useRef, useState } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { SafeAreaView, TouchableOpacity, View } from "react-native";

import { AssetModal } from "./AssetModal";
import {
  AssetsAndMetadataIssue,
  AssetsAndMetadataIssueObject,
} from "./AssetsAndMetadataIssue";

import trashSVG from "@/assets/icons/trash.svg";
import { BrandText } from "@/components/BrandText";
import { SelectedFilesPreview } from "@/components/FilePreview/SelectedFilesPreview/SelectedFilesPreview";
import { SVG } from "@/components/SVG";
import { FileUploaderSmall } from "@/components/inputs/FileUploaderSmall";
import { FileUploaderSmallHandle } from "@/components/inputs/FileUploaderSmall/FileUploaderSmall.type";
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
import { errorColor, neutral33 } from "@/utils/style/colors";
import { fontMedium14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { LocalFileData } from "@/utils/types/files";
import {
  CollectionAssetsAttributeFormValues,
  CollectionAssetsMetadataFormValues,
  CollectionAssetsMetadatasFormValues,
} from "@/utils/types/launchpad";

interface Props {
  assetsMetadatasForm: UseFormReturn<CollectionAssetsMetadatasFormValues>;
}

export const AssetsTab: React.FC<Props> = ({ assetsMetadatasForm }) => {
  const isMobile = useIsMobile();
  const { setToast } = useFeedbacks();
  const [selectedElemIndex, setSelectedElemIndex] = useState<number>();
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

  const attributesUploaderRef = useRef<FileUploaderSmallHandle>(null);
  const assetsUploaderRef = useRef<FileUploaderSmallHandle>(null);
  const imagesUploaderRef = useRef<FileUploaderSmallHandle>(null);

  const [assetModalVisible, setAssetModalVisible] = useState(false);
  const selectedElem = fields.find((_, index) => index === selectedElemIndex);
  const [attributesIssues, setAttributesIssues] = useState<
    AssetsAndMetadataIssueObject[]
  >([]);
  const [assetsIssues, setAssetsIssues] = useState<
    AssetsAndMetadataIssueObject[]
  >([]);
  const [imagesIssues, setImagesIssues] = useState<
    AssetsAndMetadataIssueObject[]
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

  const resetAllIssues = () => {
    setAssetsIssues([]);
    setAttributesIssues([]);
    setImagesIssues([]);
  };
  // We keep showing only the warnings if a image or mapping file is selected without error
  const resetIssuesErrors = () => {
    setAttributesIssues((issues) =>
      issues.filter((issue) => issue.type !== "error"),
    );
    setAssetsIssues((issues) =>
      issues.filter((issue) => issue.type !== "error"),
    );
    setImagesIssues((issues) =>
      issues.filter((issue) => issue.type !== "error"),
    );
  };

  const resetAll = () => {
    setAssetsMappingDataRows([]);
    setAttributesMappingDataRows([]);
    assetsMetadatasForm.setValue("assetsMetadatas", []);
    resetAllIssues();
    attributesUploaderRef.current?.resetFiles();
    assetsUploaderRef.current?.resetFiles();
    imagesUploaderRef.current?.resetFiles();
  };

  // We ignore the first row since it's the table headings
  // We ignore unwanted empty lines from the CSV
  const cleanDataRows = (array: string[][]) =>
    array.filter(
      (dataRow, dataRowIndex) => dataRow[0] !== "" && dataRowIndex > 0,
    );
  // Converts attributes ids as string to array of ids
  const cleanAssetAttributesIds = (ids?: string) =>
    ids
      ?.split(attributesIdsSeparator)
      .map((id) => id.trim())
      .filter((id) => NUMBERS_COMMA_SEPARATOR_REGEXP.test(id)) || [];

  // On remove image manually
  const onRemoveImage = (index: number) => {
    remove(index);
  };
  // If all images are removed, we clear the images issues and the input file images
  useEffect(() => {
    if (!fields.length) {
      setImagesIssues([]);
      imagesUploaderRef.current?.resetFiles();
    }
  }, [fields.length]);

  // On upload attributes CSV mapping file
  const onUploadAttributesMapingFile = (files: LocalFileData[]) => {
    resetAllIssues();
    setAssetsMappingDataRows([]);
    assetsMetadatasForm.setValue("assetsMetadatas", []);

    try {
      parse<string[]>(files[0].file, {
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
            setAttributesIssues((issues) => [
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

          // Controlling attributes
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
            const title = `Incomplete ${pluralize("attribute", missingIdRows.length)}`;
            const message = `Missing "id" in ${pluralize("attribute", missingIdRows.length, true)} that ${pluralize("has", missingIdRows.length)} been ignored.\nPlease complete properly your attributes mapping file.\nCheck the description for more information.`;
            console.warn(title + ".\n" + message);
            setAttributesIssues((issues) => [
              ...issues,
              {
                title,
                message,
                type: "warning",
              },
            ]);
          }
          if (missingTypeRows.length) {
            const title = `Incomplete ${pluralize("attribute", missingTypeRows.length)}`;
            const message = `Missing "type" in ${pluralize("attribute", missingTypeRows.length, true)} that ${pluralize("has", missingTypeRows.length)} been ignored.\nPlease complete properly your attributes mapping file.\nCheck the description for more information.`;
            console.warn(title + ".\n" + message);
            setAttributesIssues((issues) => [
              ...issues,
              {
                title,
                message,
                type: "warning",
              },
            ]);
          }
          if (missingValueRows.length) {
            const title = `Incomplete ${pluralize("attribute", missingValueRows.length)}`;
            const message = `Missing "value" in ${pluralize("attribute", missingValueRows.length, true)} that ${pluralize("has", missingValueRows.length)} been ignored.\nPlease complete properly your attributes mapping file.\nCheck the description for more information.`;
            console.warn(title + ".\n" + message);
            setAttributesIssues((issues) => [
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
            const message = `${pluralize("attribute", wrongIdRows.length, true)} ${pluralize("has", wrongIdRows.length)} a wrong "id" value and ${pluralize("has", wrongIdRows.length)} beed ignored. Only a number is allowed.\nCheck the description for more information.`;
            console.warn(title + ".\n" + message);
            setAttributesIssues((issues) => [
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
  const onUploadAssetsMappingFile = (files: LocalFileData[]) => {
    resetIssuesErrors();
    setAssetsIssues([]);
    setImagesIssues([]);
    assetsMetadatasForm.setValue("assetsMetadatas", []);
    imagesUploaderRef.current?.resetFiles();

    try {
      parse<string[]>(files[0].file, {
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
            setAssetsIssues((issues) => [
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

          // Controlling assets and attributes
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
              const assetAttributesIds = cleanAssetAttributesIds(
                assetDataRow[attributesColIndex],
              );
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
            const title = `Incomplete ${pluralize("asset", missingNameRows.length)}`;
            const message = `Missing "name" in ${pluralize("asset", missingNameRows.length, true)} that ${pluralize("has", missingNameRows.length)} been ignored.\nPlease complete properly your assets mapping file.\nCheck the description for more information.`;
            console.warn(title + ".\n" + message);
            setAssetsIssues((issues) => [
              ...issues,
              {
                title,
                message,
                type: "warning",
              },
            ]);
          }
          if (missingAttributesRows.length) {
            const title = `Incomplete ${pluralize("asset", missingAttributesRows.length)}`;
            const message = `Missing "attributes" in ${pluralize("asset", missingAttributesRows.length, true)} that ${pluralize("has", missingAttributesRows.length)} been ignored.\nPlease complete properly your assets mapping file.\nCheck the description for more information.`;
            console.warn(title + ".\n" + message);
            setAssetsIssues((issues) => [
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
            const message = `${pluralize("asset", wrongAttributesRowsInAssets.length, true)} ${pluralize("has", wrongAttributesRowsInAssets.length)} a wrong "attributes" value and ${pluralize("has", wrongAttributesRowsInAssets.length)} been ignored. Only numbers with comma separator are allwowed.\nCheck the description for more information.`;
            console.warn(title + ".\n" + message);
            setAssetsIssues((issues) => [
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
            const message = `${pluralize("asset", wrongUrlsRowsInAssets.length, true)} ${pluralize("has", wrongUrlsRowsInAssets.length)} a wrong "youtube_url" or "external_url" value (No incidence).\nCheck the description for more information.`;
            console.warn(title + ".\n" + message);
            setAssetsIssues((issues) => [
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
            const message = `${pluralize("asset", unknownAttributesRowsInAssets.length, true)} ${pluralize("has", unknownAttributesRowsInAssets.length)} at least one "attributes" id that doesn't exist in your attributes mapping file. (No incidence)\nCheck the description for more information.`;
            console.warn(title + ".\n" + message);
            setAssetsIssues((issues) => [
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
    resetIssuesErrors();
    setImagesIssues([]);

    const collectionAssetsMetadatas: CollectionAssetsMetadataFormValues[] = [];

    //The rows order in the CSV determines the assets order.
    assetsMappingDataRows.forEach((assetDataRow, assetDataRowIndex) => {
      images.forEach((image) => {
        if (assetDataRow[fileNameColIndex] !== image.file.name) return;
        // --- Mapping attributes
        const mappedAttributes: CollectionAssetsAttributeFormValues[] = [];
        const assetAttributesIds = [
          ...new Set(cleanAssetAttributesIds(assetDataRow[attributesColIndex])),
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
      const title = `Unexpected ${pluralize("image", nbUnexpectedImages)}`;
      const message = `${pluralize("image", nbUnexpectedImages, true)} ${pluralize("is", nbUnexpectedImages)} not expected in your assets mapping file and ${pluralize("has", nbUnexpectedImages)} been ignored.\nCheck the description for more information.`;
      console.warn(title + ".\n" + message);
      setImagesIssues((issues) => [
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
      const title = `Missing ${pluralize("image", nbMissingImages)}`;
      const message = `${pluralize("image", nbMissingImages, true)} expected in your assets mapping file ${pluralize("is", nbMissingImages)} missing.\nCheck the description for more information.`;
      console.warn(title + ".\n" + message);
      setImagesIssues((issues) => [
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
      {/* ===== Issues */}
      {attributesIssues.map((issue, index) => (
        <AssetsAndMetadataIssue
          key={index}
          issue={issue}
          removeIssue={() =>
            setAttributesIssues((issues) =>
              issues.filter((_, i) => i !== index),
            )
          }
        />
      ))}
      {assetsIssues.map((issue, index) => (
        <AssetsAndMetadataIssue
          key={index}
          issue={issue}
          removeIssue={() =>
            setAssetsIssues((issues) => issues.filter((_, i) => i !== index))
          }
        />
      ))}
      {imagesIssues.map((issue, index) => (
        <AssetsAndMetadataIssue
          key={index}
          issue={issue}
          removeIssue={() =>
            setImagesIssues((issues) => issues.filter((_, i) => i !== index))
          }
        />
      ))}

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
                  <ResetAllButton onPress={resetAll} />
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
              setAssetModalVisible(true);
              setSelectedElemIndex(itemIndex);
            }}
            onPressDeleteItem={onRemoveImage}
          />
        </View>

        {selectedElem && selectedElemIndex !== undefined && (
          <AssetModal
            onClose={() => setAssetModalVisible(false)}
            isVisible={assetModalVisible}
            elem={selectedElem}
            elemIndex={selectedElemIndex}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const ResetAllButton: FC<{
  onPress: () => void;
}> = ({ onPress }) => {
  return (
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
      onPress={onPress}
    >
      <SVG source={trashSVG} width={16} height={16} />
      <SpacerRow size={1} />
      <BrandText
        style={[
          fontMedium14,
          { color: errorColor, lineHeight: layout.spacing_x2 },
        ]}
      >
        Remove all files
      </BrandText>
    </TouchableOpacity>
  );
};

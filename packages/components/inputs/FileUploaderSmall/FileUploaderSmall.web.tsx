import pluralize from "pluralize";
import React, {
  forwardRef,
  SyntheticEvent,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { StyleSheet, View } from "react-native";

import {
  FileUploaderSmallHandle,
  FileUploaderSmallProps,
} from "./FileUploaderSmall.type";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { secondaryColor } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVGorImageIcon } from "../../SVG/SVGorImageIcon";
import { PrimaryBox } from "../../boxes/PrimaryBox";
import { Label } from "../TextInputCustom";
import { formatFile } from "../fileUploader/formatFile";

import addSVG from "@/assets/icons/add-circle.svg";
import filesSVG from "@/assets/icons/files.svg";
import { DeleteButton } from "@/components/FilePreview/DeleteButton";
import { OptimizedImage } from "@/components/OptimizedImage";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { SpacerRow } from "@/components/spacer";
import { LocalFileData } from "@/utils/types/files";

export const FileUploaderSmall = forwardRef<
  FileUploaderSmallHandle,
  FileUploaderSmallProps
>(
  (
    {
      label,
      style,
      onUpload,
      multiple,
      mimeTypes,
      maxUpload,
      filesCount,
      setIsLoading,
      required,
      boxStyle,
      imageToShow,
      onPressDelete,
      disabled,
    },
    forwardRef,
  ) => {
    const { setToast } = useFeedbacks();
    const hiddenFileInputRef = useRef<HTMLInputElement>(null);
    const [hovered, setHovered] = useState(false);
    const [addedFiles, setAddedFiles] = useState<LocalFileData[]>([]);
    const flatBoxStyle = StyleSheet.flatten(boxStyle);
    const minHeight = flatBoxStyle.minHeight || 80;

    useImperativeHandle(forwardRef, () => ({
      resetFiles: () => {
        if (hiddenFileInputRef.current) {
          hiddenFileInputRef.current.value = "";
          setAddedFiles([]);
        }
      },
    }));

    const handleFiles = async (files: File[]) => {
      const _files = multiple ? files : [files[0]];
      let supportedFiles = [...files].filter((file) =>
        mimeTypes?.includes(file.type),
      );
      if (maxUpload && supportedFiles.length) {
        supportedFiles = supportedFiles.slice(0, maxUpload);
      }

      if (
        supportedFiles.length === 0 ||
        (multiple && supportedFiles.length !== _files.length)
      ) {
        setToast({
          title: "Unsupported file type",
          duration: 5000,
          mode: "normal",
          type: "error",
        });
        return;
      }
      const formattedFiles = await Promise.all(
        supportedFiles.map(async (file) => await formatFile(file)),
      );
      setAddedFiles(formattedFiles);
      onUpload(formattedFiles);
    };

    const handleChange = async (event: SyntheticEvent) => {
      setIsLoading?.(true);
      const targetEvent = event.target as HTMLInputElement;

      if (targetEvent.files && targetEvent.files[0]) {
        await handleFiles(targetEvent?.files as unknown as File[]);
      }
      setIsLoading?.(false);
    };
    const handleClick = () => {
      hiddenFileInputRef?.current?.click?.();
    };

    const InputComponent = (
      <input
        type="file"
        ref={hiddenFileInputRef}
        style={{ display: "none", position: "absolute" }}
        onChange={handleChange}
        multiple={multiple}
        accept={mimeTypes?.join(",")}
        disabled={disabled}
      />
    );

    return (
      <CustomPressable
        style={[disabled && { opacity: 0.5 }, style]}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        onPress={handleClick}
        disabled={disabled}
      >
        {!!label && (
          <Label
            style={{ marginBottom: layout.spacing_x1 }}
            isRequired={required}
            hovered={hovered}
          >
            {label}
          </Label>
        )}

        {imageToShow ? (
          <View style={{ alignItems: "center" }}>
            {onPressDelete && (
              <DeleteButton
                onPress={onPressDelete}
                style={{ top: 12, right: 0 }}
              />
            )}
            <OptimizedImage
              sourceURI={imageToShow.url}
              width={250}
              height={250}
              resizeMode="cover"
              style={{
                borderRadius: 8,
                height: 256,
                width: 256,
              }}
              alt="Uploaded file"
            />
          </View>
        ) : (
          <PrimaryBox
            style={[
              {
                width: "100%",
                minHeight,
                flex: 1,
                paddingHorizontal: layout.spacing_x1_5,
                borderRadius: 12,
                borderWidth: 1,
              },
              hovered && { borderColor: secondaryColor },
              boxStyle,
            ]}
          >
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                minHeight,
              }}
            >
              <View style={{ height: 32, width: 32 }}>
                <SVGorImageIcon
                  icon={filesCount > 0 ? filesSVG : addSVG}
                  iconSize={32}
                />
              </View>

              <SpacerRow size={1} />
              <BrandText
                style={[fontSemibold14, { color: secondaryColor }]}
                numberOfLines={1}
              >
                {!multiple && filesCount && filesCount === addedFiles.length
                  ? addedFiles[0].file.name
                  : !multiple && !filesCount
                    ? "Select file"
                    : multiple && filesCount
                      ? `${pluralize("file", filesCount, true)} selected`
                      : multiple && !filesCount
                        ? "Select files"
                        : ""}
              </BrandText>
            </View>
          </PrimaryBox>
        )}

        {InputComponent}
      </CustomPressable>
    );
  },
);

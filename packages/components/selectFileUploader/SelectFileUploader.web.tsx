import React, { FC, SyntheticEvent, useRef, useState } from "react";
import { View, Image } from "react-native";

import { SelectFileUploaderProps } from "./SelectFileUploader.type";
import { formatFile } from "./formatFile";
import addSVG from "../../../assets/icons/add-circle.svg";
import filesSVG from "../../../assets/icons/files.svg";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import {
  neutral17,
  primaryColor,
  secondaryColor,
} from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { LocalFileData } from "../../utils/types/files";
import { BrandText } from "../BrandText";
import { DeleteButton } from "../FilePreview/DeleteButton";
import { SVGorImageIcon } from "../SVG/SVGorImageIcon";
import { PrimaryBox } from "../boxes/PrimaryBox";
import { Label } from "../inputs/TextInputCustom";

import { CustomPressable } from "@/components/buttons/CustomPressable";

export const SelectFileUploader: FC<SelectFileUploaderProps> = ({
  label,
  style,
  onUpload,
  files,
  // multiple is not used at true for now, needs to refactor in parents
  multiple,
  mimeTypes,
  children,
  maxUpload,
  isImageCover,
  fileHeight = 256,
  containerHeight = 80,
  setIsLoading,
  isRequired = true,
}) => {
  const { setToastError } = useFeedbacks();
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [hovered, setHovered] = useState(false);
  const [localFiles, setLocalFiles] = useState<LocalFileData[]>([]);
  const filesToUse = (!localFiles.length ? files : localFiles) || [];

  const handleFiles = async (files: File[]) => {
    const _files = multiple ? files : [files[0]];
    let supportedFiles = [...files].filter((file) =>
      mimeTypes?.includes(file.type),
    );

    if (maxUpload && supportedFiles.length) {
      supportedFiles = supportedFiles.slice(0, maxUpload);
    }

    if (supportedFiles.length === 0) {
      setToastError({
        title: "Unsupported file type.",
        message: "Sorry we couldn't upload file.",
      });
      return;
    } else if (multiple && supportedFiles.length !== _files.length) {
      setToastError({
        title: "Unsupported file type.",
        message: "Sorry we couldn't upload some files at the moment.",
      });
    }

    const formattedFiles = await Promise.all(supportedFiles.map(formatFile));

    setLocalFiles(formattedFiles);
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
    hiddenFileInput?.current?.click?.();
  };

  const dropHandler = async (ev: any) => {
    setIsLoading?.(true);
    ev.preventDefault();
    if (ev.dataTransfer.items) {
      const files = [...ev.dataTransfer.items]
        .filter((item: any) => item.kind === "file")
        .map((item: any) => item.getAsFile());
      await handleFiles(files);
    } else {
      await handleFiles(ev.dataTransfer.files);
    }
    setIsLoading?.(false);
  };

  const dragOverHandler = (ev: SyntheticEvent) => {
    ev.preventDefault();
  };

  const InputComponent = (
    <input
      type="file"
      ref={hiddenFileInput}
      style={{ display: "none", position: "absolute" }}
      onChange={handleChange}
      multiple={multiple}
      accept={mimeTypes?.join(",")}
    />
  );

  if (children) {
    return (
      <>
        {children({ onPress: handleClick })}
        {InputComponent}
      </>
    );
  }

  return (
    <CustomPressable
      style={style}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPress={handleClick}
    >
      <View>
        {!!label && (
          <Label
            style={{ marginBottom: layout.spacing_x1 }}
            isRequired={isRequired}
            hovered={hovered}
          >
            {label}
          </Label>
        )}
        <div
          onDrop={dropHandler}
          onDragOver={dragOverHandler}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            height:
              filesToUse.length > 0 && !multiple ? fileHeight : containerHeight,
            borderRadius: 12,
          }}
        >
          {filesToUse.length > 0 && !multiple ? (
            <>
              <DeleteButton
                onPress={() => {
                  setLocalFiles([]);
                  onUpload([]);
                }}
                style={{ top: 12, right: 12 }}
              />
              <Image
                source={{ uri: URL.createObjectURL(filesToUse[0].file) }}
                style={{
                  overflow: "hidden",
                  height: fileHeight,
                  width: isImageCover ? "100%" : "auto",
                  objectFit: isImageCover ? "cover" : "fill",
                }}
              />
            </>
          ) : (
            <PrimaryBox
              style={[
                {
                  flex: 1,
                  width: "100%",
                  height:
                    filesToUse.length > 0 && !multiple
                      ? fileHeight
                      : containerHeight,
                  alignItems: "center",
                  padding: layout.spacing_x2_5,
                  borderRadius: 12,
                  borderWidth: 1,
                },
                hovered && { borderColor: secondaryColor },
              ]}
            >
              {filesToUse.length > 0 && multiple ? (
                <View
                  style={{
                    height: "100%",
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <SVGorImageIcon
                      icon={filesSVG}
                      iconSize={40}
                      style={{ tintColor: "red" }}
                    />
                  </View>
                  <View>
                    <BrandText
                      style={[fontSemibold14, { color: secondaryColor }]}
                    >
                      {filesToUse.length} files selected
                    </BrandText>
                  </View>
                  <input
                    type="file"
                    ref={hiddenFileInput}
                    style={{ display: "none", position: "absolute" }}
                    onChange={handleChange}
                    multiple={multiple}
                    accept={mimeTypes?.join(",")}
                  />
                </View>
              ) : (
                <View
                  style={{
                    height: "100%",
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      height: 32,
                      width: 32,
                      borderRadius: 24,
                      backgroundColor: neutral17,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: layout.spacing_x2,
                    }}
                  >
                    <SVGorImageIcon
                      icon={addSVG}
                      iconSize={40}
                      style={{ tintColor: "red" }}
                    />
                  </View>
                  <View>
                    <BrandText
                      style={[fontSemibold14, { color: primaryColor }]}
                    >
                      {`Select file${multiple ? "s" : ""}`}
                    </BrandText>
                  </View>
                  <input
                    type="file"
                    ref={hiddenFileInput}
                    style={{ display: "none", position: "absolute" }}
                    onChange={handleChange}
                    multiple={multiple}
                    accept={mimeTypes?.join(",")}
                  />
                </View>
              )}
            </PrimaryBox>
          )}
        </div>
      </View>
      {InputComponent}
    </CustomPressable>
  );
};

import React, { FC, SyntheticEvent, useRef, useState } from "react";
import { TouchableOpacity, View, Image } from "react-native";

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

export const SelectFileUploader: FC<SelectFileUploaderProps> = ({
  label,
  style,
  onUpload,
  // multiple is not used at true for now, needs to refactor in parents
  multiple,
  mimeTypes,
  children,
  maxUpload,
  isImageCover,
  fileHeight = 256,
  containerHeight = 80,
  setIsLoading,
}) => {
  const { setToastError } = useFeedbacks();
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<LocalFileData[]>([]);

  const handleFiles = async (files: File[]) => {
    const _files = multiple ? files : [files[0]];
    let supportedFiles = [...files].filter(
      (file) => mimeTypes?.includes(file.type),
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

    setFiles(formattedFiles);
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
    <>
      <View style={[style]}>
        {!!label && <Label style={{ marginBottom: 12 }}>{label}</Label>}
        <TouchableOpacity onPress={handleClick}>
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
                files.length > 0 && !multiple ? fileHeight : containerHeight,
              borderRadius: 12,
            }}
          >
            {files.length > 0 && !multiple ? (
              <>
                <DeleteButton
                  onPress={() => {
                    setFiles([]);
                    onUpload([]);
                  }}
                  style={{ top: 12, right: 12 }}
                />
                <Image
                  source={{ uri: URL.createObjectURL(files[0].file) }}
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
                style={{
                  flex: 1,
                  width: "100%",
                  height:
                    files.length > 0 && !multiple
                      ? fileHeight
                      : containerHeight,
                  alignItems: "center",
                  padding: layout.spacing_x2_5,
                  borderRadius: 12,
                  borderWidth: 1,
                }}
              >
                {files.length > 0 && multiple ? (
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
                        {files.length} files selected
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
                        Select files
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
        </TouchableOpacity>
      </View>
      {InputComponent}
    </>
  );
};

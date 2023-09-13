import React, { FC, SyntheticEvent, useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { FileUploaderProps } from "./FileUploader.type";
import { formatFile } from "./formatFile";
import uploadSVG from "../../../assets/icons/upload.svg";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import {
  gradientColorBlue,
  gradientColorDarkerBlue,
  gradientColorTurquoise,
  neutral17,
  neutral77,
  withAlpha,
} from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { DeleteButton } from "../FilePreview/DeleteButton";
import { SVG } from "../SVG";
import { PrimaryBox } from "../boxes/PrimaryBox";
import { GradientText } from "../gradientText";
import { Label } from "../inputs/TextInputCustom";

export const FileUploader: FC<FileUploaderProps> = ({
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
  setIsLoading,
}) => {
  const { setToastError } = useFeedbacks();
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState("");

  const handleFiles = async (files: File[]) => {
    const _files = multiple ? files : [files[0]];
    let supportedFiles = [...files].filter((file) =>
      mimeTypes?.includes(file.type)
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
    if (!multiple) {
      setFile(URL.createObjectURL(_files[0]));
    }

    const formattedFiles = await Promise.all(
      supportedFiles.map(async (file) => await formatFile(file))
    );

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
              height: file ? fileHeight : 80,
              borderRadius: 12,
            }}
          >
            {file ? (
              <>
                <DeleteButton
                  onPress={() => {
                    setFile("");
                    onUpload([]);
                  }}
                  style={{ top: 12, right: 12 }}
                />
                <img
                  src={file}
                  style={{
                    overflow: "hidden",
                    height: fileHeight,
                    backgroundSize: "cover",
                    width: isImageCover ? "100%" : "auto",
                    objectFit: isImageCover ? "cover" : "fill",
                  }}
                  alt="Uploaded file"
                />
              </>
            ) : (
              <PrimaryBox
                noBrokenCorners
                fullWidth
                colors={[
                  withAlpha(gradientColorDarkerBlue, 0.5),
                  withAlpha(gradientColorBlue, 0.5),
                  withAlpha(gradientColorTurquoise, 0.5),
                ]}
                style={{ flex: 1 }}
                mainContainerStyle={{
                  height: file ? fileHeight : 80,
                  alignItems: "center",
                  padding: layout.spacing_x2_5,
                  borderRadius: 12,
                }}
              >
                <View
                  style={{
                    height: "100%",
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      height: 40,
                      width: 40,
                      borderRadius: 24,
                      backgroundColor: neutral17,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 20,
                    }}
                  >
                    <SVG source={uploadSVG} height={20} />
                  </View>
                  <View>
                    <GradientText gradientType="blueExtended">
                      Browse file
                    </GradientText>
                    <BrandText style={[fontSemibold14, { color: neutral77 }]}>
                      Or drag & drop here
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
              </PrimaryBox>
            )}
          </div>
        </TouchableOpacity>
      </View>
      {InputComponent}
    </>
  );
};

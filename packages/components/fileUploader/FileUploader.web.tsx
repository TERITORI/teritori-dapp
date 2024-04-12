import React, { FC, SyntheticEvent, useRef, useState } from "react";
import { View } from "react-native";

import { FileUploaderProps } from "./FileUploader.type";
import { formatFile } from "./formatFile";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import {
  neutral17,
  neutral77,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { DeleteButton } from "../../FilePreview/DeleteButton";
import { SVG } from "../../SVG";
import { GradientText } from "../../gradientText";
import { Label } from "../TextInputCustom";

import uploadSVG from "@/assets/icons/upload.svg";
import { PrimaryBox } from "@/components/boxes/PrimaryBox";
import { CustomPressable } from "@/components/buttons/CustomPressable";

export const FileUploader: FC<FileUploaderProps> = ({
  label,
  style,
  fileImageStyle,
  onUpload,
  // multiple is not used at true for now, needs to refactor in parents
  multiple,
  mimeTypes,
  children,
  maxUpload,
  setIsLoading,
  required,
}) => {
  const { setToast } = useFeedbacks();
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState("");
  const [hovered, setHovered] = useState(false);

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
    if (!multiple) {
      setFile(URL.createObjectURL(_files[0]));
    }

    const formattedFiles = await Promise.all(
      supportedFiles.map(async (file) => await formatFile(file)),
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
      <CustomPressable
        style={[style]}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        onPress={handleClick}
      >
        {!!label && (
          <Label
            isRequired={required}
            style={{ marginBottom: 12 }}
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
                  height: 256,
                  backgroundSize: "cover",
                  width: "auto",
                  objectFit: "fill",
                  ...fileImageStyle,
                }}
                alt="Uploaded file"
              />
            </>
          ) : (
            <PrimaryBox
              style={[
                hovered && { borderColor: secondaryColor },
                {
                  flex: 1,
                  height: 80,
                  alignItems: "center",
                  padding: layout.spacing_x2_5,
                  borderRadius: 12,
                },
              ]}
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
      </CustomPressable>
      {InputComponent}
    </>
  );
};

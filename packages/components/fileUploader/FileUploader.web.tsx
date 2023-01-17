import React, { SyntheticEvent, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import bucketSVG from "../../../assets/icons/bucket.svg";
import uploadSVG from "../../../assets/icons/upload.svg";
import { BrandText } from "../../components/BrandText";
import { GradientText } from "../../components/gradientText";
import { Label } from "../../components/inputs/TextInputCustom";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { neutral17, neutral77, redDefault } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { SVG } from "../SVG";
import { PrimaryBox } from "../boxes/PrimaryBox";
import { FileUploaderProps } from "./FileUploader.type";
const FILE_HEIGHT = 256;

export const FileUploader: React.FC<FileUploaderProps> = ({
  label,
  style,
  onUpload,
  multiple,
  mimeTypes,
  children,
}) => {
  const { setToastError } = useFeedbacks();
  const hiddenFileInput = React.useRef<HTMLInputElement>(null);
  const [file, setFile] = useState("");

  const handleFiles = (files: File[]) => {
    const _files = multiple ? files : [files[0]];
    const supportedFiles = [...files].filter((file) =>
      mimeTypes?.includes(file.type)
    );

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

    onUpload(supportedFiles);
  };

  const handleChange = (event: SyntheticEvent) => {
    const targetEvent = event.target as HTMLInputElement;
    if (targetEvent.files && targetEvent.files[0]) {
      handleFiles(targetEvent?.files as unknown as File[]);
    }
  };

  const handleClick = () => {
    hiddenFileInput?.current?.click?.();
  };

  const dropHandler = (ev: any) => {
    ev.preventDefault();

    if (ev.dataTransfer.items) {
      const files = [...ev.dataTransfer.items]
        .filter((item: any) => item.kind === "file")
        .map((item: any) => item.getAsFile());
      handleFiles(files);
    } else {
      handleFiles(ev.dataTransfer.files);
    }
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
        <PrimaryBox
          fullWidth
          style={{
            height: file ? FILE_HEIGHT : 80,
            borderRadius: 10,
          }}
        >
          {file ? (
            <div
              style={{
                height: "100%",
                width: "100%",
              }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  height: 32,
                  width: 32,
                  borderRadius: 24,
                  position: "absolute",
                  top: 12,
                  right: 12,
                  backgroundColor: redDefault,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  setFile("");
                  onUpload([]);
                }}
              >
                <SVG source={bucketSVG} height={16} width={16} />
              </TouchableOpacity>
              <img
                src={file}
                style={{
                  overflow: "hidden",
                  height: FILE_HEIGHT,
                  width: "100%",
                  backgroundSize: "cover",
                }}
              />
            </div>
          ) : (
            <TouchableOpacity
              onPress={handleClick}
              style={{
                paddingVertical: 20,
                paddingHorizontal: 20,
                width: "100%",
                height: "100%",
              }}
            >
              <div
                onDrop={dropHandler}
                onDragOver={dragOverHandler}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
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
              </div>
            </TouchableOpacity>
          )}
        </PrimaryBox>
      </View>
      {InputComponent}
    </>
  );
};

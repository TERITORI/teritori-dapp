import React, { FC, SyntheticEvent, useRef, useState } from "react";
import { ImageStyle, StyleProp, TouchableOpacity, View } from "react-native";

import picSVG from "../../../../../assets/icons/pic.svg";
import uploadSVG from "../../../../../assets/icons/upload.svg";

import { BrandText } from "@/components/BrandText";
import { DeleteButton } from "@/components/FilePreview/DeleteButton";
import { OptimizedImage } from "@/components/OptimizedImage";
import { SVG } from "@/components/SVG";
import { PrimaryBox } from "@/components/boxes/PrimaryBox";
import { FileUploaderProps } from "@/components/fileUploader/FileUploader.type";
import { formatFile } from "@/components/fileUploader/formatFile";
import { AnimatedLoader } from "@/components/loaders/AnimatedLoader";
import { SpacerColumn } from "@/components/spacer";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import {
  neutral17,
  neutral30,
  neutral77,
  neutralA3,
  primaryColor,
} from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

type MintUploaderProps = Omit<FileUploaderProps, "fileImageStyle"> & {
  fileImageStyle?: StyleProp<ImageStyle>;
};

export const MintUploader: FC<MintUploaderProps> = ({
  defaultFile,
  style,
  fileImageStyle,
  onUpload,
  mimeTypes,
  children,
  maxUpload,
  setIsLoading: setIsLoadingExternal,
}) => {
  const { setToastError } = useFeedbacks();
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState(defaultFile);
  const [isLoadingInternal, setIsLoadingInternal] = useState(false);

  const setIsLoading = (value: boolean) => {
    setIsLoadingInternal(value);
    setIsLoadingExternal?.(value);
  };

  const handleFiles = async (files: File[]) => {
    console.log("handles files", files);

    const _files = [files[0]];
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
    }
    setFile(URL.createObjectURL(_files[0]));

    const formattedFiles = await Promise.all(
      supportedFiles.map(async (file) => await formatFile(file)),
    );

    await onUpload(formattedFiles);
  };

  const handleChange = async (event: SyntheticEvent) => {
    setIsLoading(true);
    try {
      const targetEvent = event.target as HTMLInputElement;

      if (targetEvent.files && targetEvent.files[0]) {
        await handleFiles(targetEvent?.files as unknown as File[]);
      }
    } catch (error) {
      setToastError({
        title: "Failed to upload file",
        message: error instanceof Error ? error.message : `${error}`,
      });
      console.error("Failed to upload files:", error);
    }
    setIsLoading(false);
  };

  const handleClick = () => {
    hiddenFileInput?.current?.click?.();
  };

  const dropHandler = async (ev: any) => {
    ev.preventDefault();
    setIsLoading(true);
    try {
      if (ev.dataTransfer.items) {
        const files = [...ev.dataTransfer.items]
          .filter((item: any) => item.kind === "file")
          .map((item: any) => item.getAsFile());
        await handleFiles(files);
      } else {
        await handleFiles(ev.dataTransfer.files);
      }
    } catch (error) {
      console.error("Failed to upload file", error);
      setToastError({
        title: "Failed to upload file",
        message: error instanceof Error ? error.message : `${error}`,
      });
    }
    setIsLoading(false);
  };

  const dragOverHandler = (ev: SyntheticEvent) => {
    ev.preventDefault();
  };

  const inputElem = (
    <input
      type="file"
      ref={hiddenFileInput}
      style={{ display: "none", position: "absolute" }}
      onChange={handleChange}
      accept={mimeTypes?.join(",")}
    />
  );

  if (children) {
    return (
      <>
        {children({ onPress: handleClick })}
        {inputElem}
      </>
    );
  }

  return (
    <>
      <View style={[style]}>
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
                <OptimizedImage
                  sourceURI={file}
                  width={250}
                  height={250}
                  style={[
                    {
                      backgroundColor: "black",
                      borderRadius: 8,
                      resizeMode: "cover",
                      height: 256,
                      width: 256,
                      opacity: isLoadingInternal ? 0.5 : 1,
                    },
                    fileImageStyle,
                  ]}
                  alt="Uploaded file"
                />
                {isLoadingInternal && (
                  <View
                    style={{
                      position: "absolute",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <AnimatedLoader />
                  </View>
                )}
              </>
            ) : (
              <View style={{ width: "100%", alignItems: "center" }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SVG source={picSVG} height={16} />
                  <BrandText
                    style={[
                      fontSemibold14,
                      {
                        color: neutralA3,
                        marginLeft: layout.spacing_x1,
                        lineHeight: layout.spacing_x2,
                      },
                    ]}
                  >
                    Upload the badge to mint
                  </BrandText>
                </View>
                <SpacerColumn size={1} />

                <View
                  style={{
                    borderColor: primaryColor,
                    borderRadius: 12,
                    borderWidth: 1,
                    padding: layout.spacing_x1,
                    borderStyle: "dashed",
                    backgroundColor: "#16BBFF1A",
                    width: 120,
                    height: 120,
                  }}
                >
                  <View
                    style={{
                      height: 100,
                      width: 100,
                      borderRadius: layout.spacing_x1,
                      backgroundColor: neutral17,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <SVG source={uploadSVG} height={20} />
                  </View>
                </View>
                <SpacerColumn size={1} />

                <PrimaryBox
                  style={{
                    width: "100%",
                    backgroundColor: neutral30,
                    borderColor: neutral30,
                    padding: layout.spacing_x1,
                    alignItems: "center",
                  }}
                >
                  <BrandText
                    style={[
                      fontSemibold14,
                      { color: neutral77, lineHeight: layout.spacing_x2 },
                    ]}
                  >
                    Drag & drop or{" "}
                    <BrandText
                      style={[
                        fontSemibold14,
                        { color: primaryColor, lineHeight: layout.spacing_x2 },
                      ]}
                    >
                      browse
                    </BrandText>{" "}
                    your file
                  </BrandText>
                </PrimaryBox>
                <input
                  type="file"
                  ref={hiddenFileInput}
                  style={{ display: "none", position: "absolute" }}
                  onChange={handleChange}
                  accept={mimeTypes?.join(",")}
                />
              </View>
            )}
          </div>
        </TouchableOpacity>
      </View>
      {inputElem}
    </>
  );
};

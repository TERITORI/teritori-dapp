import React, { createRef, useState } from "react";
import { Image, Pressable } from "react-native";

import pdfSVG from "../../../assets/icons/pdf.svg";
import videoSVG from "../../../assets/icons/video.svg";
import { primaryColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
export enum GigUploadFileType {
  IMAGE,
  PDF,
  VIDEO,
}
export const DragDropFile: React.FC<{
  setFile: any;
  url: string;
  accept?: string;
  fileType?: GigUploadFileType;
  isImage?: boolean;
}> = ({
  setFile,
  url,
  accept = "image/png,image/jpg,image/gif",
  fileType = GigUploadFileType.IMAGE,
  children,
}) => {
  const inputRef = createRef<HTMLInputElement>();

  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: any) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div
      style={{
        width: "240px",
        height: "180px",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        borderRadius: "12px",
        border: "1px solid #333333",
        backgroundColor: dragActive ? "#111111" : "#000000",
        position: "relative",
      }}
      onDragEnter={handleDrag}
    >
      {dragActive && (
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            zIndex: 1,
          }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        />
      )}
      {url !== "" && fileType === GigUploadFileType.PDF && (
        <SVG source={pdfSVG} />
      )}
      {url !== "" && fileType === GigUploadFileType.VIDEO && (
        <SVG source={videoSVG} />
      )}
      {url !== "" && fileType === GigUploadFileType.IMAGE && (
        <Image
          source={{ uri: url }}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            zIndex: 2,
            borderRadius: 12,
          }}
        />
      )}
      {url === "" && (
        <>
          <>{children}</>
          <Pressable
            onPress={() => {
              inputRef.current?.click();
            }}
          >
            <input
              type="file"
              style={{ display: "none" }}
              accept={accept}
              onChange={handleChange}
              ref={inputRef}
            />
            <BrandText style={[fontSemibold14, { color: primaryColor }]}>
              Browse
            </BrandText>
          </Pressable>
        </>
      )}
    </div>
  );
};

import { ImagePickerAsset } from "expo-image-picker";

import { AUDIO_MIME_TYPES, IMAGE_MIME_TYPES, VIDEO_MIME_TYPES } from "./mime";
import { LocalFileData } from "./types/feed";
import { FileType } from "./types/files";

export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result as string);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

export const urlToFile = async ({
  url,
  filename,
  mimeType,
}: {
  url: string;
  filename: string;
  mimeType?: string;
}) => {
  if (url.startsWith("data:")) {
    const arr = url.split(",");
    const mime = arr?.[0]?.match(/:(.*?);/)?.[1];
    const bstr = atob(arr[arr.length - 1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const file = new File([u8arr], filename, { type: mime });
    return Promise.resolve(file);
  }
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  return new File([buf], filename, { type: mimeType });
};

export const getFileTypeByMimeType = (mimeType: string): FileType => {
  let fileType: FileType = "file";
  if (AUDIO_MIME_TYPES.includes(mimeType)) {
    fileType = "audio";
  } else if (VIDEO_MIME_TYPES.includes(mimeType)) {
    fileType = "video";
  } else if (IMAGE_MIME_TYPES.includes(mimeType)) {
    fileType = "image";
  }

  return fileType;
};

export const imagePickerAssetToLocalFile = async (
  asset: ImagePickerAsset
): Promise<LocalFileData> => {
  const arr = asset.uri.split(",");
  const mime = arr?.[0]?.match(/:(.*?);/)?.[1];
  const type = getFileTypeByMimeType(mime || "");

  return {
    file: new File([], ""),
    fileName: asset.fileName,
    mimeType: mime,
    size: asset.fileSize,
    url: asset.uri,
    fileType: type,
  };
};

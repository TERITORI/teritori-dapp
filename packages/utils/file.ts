import { ImagePickerAsset } from "expo-image-picker";

import { LocalFileData } from "./types/feed";

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

export const imagePickerAssetToLocalFile = (
  asset: ImagePickerAsset
): LocalFileData => {
  return {
    file: asset,
    fileName: asset.fileName,
    mimeType: asset.fileName,
    size: asset.fileSize,
    url: asset.uri,
    fileType: asset.type,
    base64Image: asset.base64,
  };
};

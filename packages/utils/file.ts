import { ImagePickerAsset } from "expo-image-picker";

import { AUDIO_MIME_TYPES, IMAGE_MIME_TYPES, VIDEO_MIME_TYPES } from "./mime";
import { FileType, LocalFileData } from "./types/files";
import { getAudioData } from "./waveform";

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

const base64ToArrayBuffer = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

export const imagePickerAssetToLocalFile = async (
  asset: ImagePickerAsset
): Promise<LocalFileData> => {
  let audioMetadata;
  const arr = asset.uri.split(",");
  const mime = arr?.[0]?.match(/:(.*?);/)?.[1];
  const type = getFileTypeByMimeType(mime || "");

  if (type === "audio") {
    audioMetadata = await getAudioData(base64ToArrayBuffer(arr[1]));
  }

  return {
    file: new File([], ""),
    fileName: asset.fileName || "",
    mimeType: mime || "",
    size: asset.fileSize || 0,
    url: asset.uri,
    fileType: type,
    audioMetadata,
  };
};

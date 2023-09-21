import { DocumentPickerAsset } from "expo-document-picker";

import {
  AUDIO_MIME_TYPES,
  IMAGE_MIME_TYPES,
  VIDEO_MIME_TYPES,
} from "./../../utils/mime";
import { FileType, LocalFileData } from "../../utils/types/files";
import { getAudioData } from "../../utils/waveform";

interface CustomFile extends File {
  path?: string;
}

export const formatFile = async (
  file: CustomFile | DocumentPickerAsset
): Promise<LocalFileData> => {
  let fileType: FileType = "file";
  let audioMetadata;

  const mimeType = file?.type || file?.mimeType;
  const uri = file.path || file.uri;

  if (AUDIO_MIME_TYPES.includes(mimeType)) {
    fileType = "audio";
    audioMetadata = await getAudioData(file);
  } else if (VIDEO_MIME_TYPES.includes(mimeType)) {
    fileType = "video";
  } else if (IMAGE_MIME_TYPES.includes(mimeType)) {
    fileType = "image";
  }

  return {
    file,
    fileName: file.name,
    url: uri || URL.createObjectURL(file),
    mimeType,
    size: file.size,
    fileType,
    audioMetadata,
  };
};

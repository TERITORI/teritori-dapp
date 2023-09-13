import {
  AUDIO_MIME_TYPES,
  IMAGE_MIME_TYPES,
  VIDEO_MIME_TYPES,
} from "./../../utils/mime";
import { FileType, LocalFileData } from "../../utils/types/files";
import { getAudioData } from "../../utils/waveform";

export const formatFile = async (file: File): Promise<LocalFileData> => {
  let fileType: FileType = "file";
  let audioMetadata;

  if (AUDIO_MIME_TYPES.includes(file.type)) {
    fileType = "audio";
    audioMetadata = await getAudioData(file);
  } else if (VIDEO_MIME_TYPES.includes(file.type)) {
    fileType = "video";
  } else if (IMAGE_MIME_TYPES.includes(file.type)) {
    fileType = "image";
  }
  return {
    file,
    fileName: file.name,
    url: file.path || URL.createObjectURL(file),
    mimeType: file.type,
    size: file.size,
    fileType,
    audioMetadata,
  };
};

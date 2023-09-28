import { getFileTypeByMimeType } from "../../utils/file";
import { LocalFileData } from "../../utils/types/files";
import { getAudioData } from "../../utils/waveform";

export const formatFile = async (file: File): Promise<LocalFileData> => {
  let audioMetadata;

  const fileType = getFileTypeByMimeType(file.type);

  if (fileType === "audio") {
    audioMetadata = await getAudioData(file);
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

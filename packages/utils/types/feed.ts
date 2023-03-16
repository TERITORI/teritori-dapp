export type FileType = "audio" | "video" | "image" | "file" | "base64";

export interface AudioFileMetadata {
  waveform: number[];
  duration: number;
}

export interface BaseFileData {
  file: File;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
  fileType: FileType;
  audioMetadata?: AudioFileMetadata;
  isCoverImage?: boolean;
  base64Image?: string;
}

export interface LocalFileData extends BaseFileData {
  thumbnailFileData?: BaseFileData;
}

export interface RemoteFileData extends Omit<BaseFileData, "file"> {
  thumbnailFileData?: Omit<BaseFileData, "file">;
}

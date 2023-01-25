export type FileType = "audio" | "video" | "image" | "file";

export const NEWS_FEED_MAX_WIDTH = 900;

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
}

export interface LocalFileData extends BaseFileData {
  thumbnailFileData?: BaseFileData;
}

export interface RemoteFileData extends Omit<BaseFileData, "file"> {
  thumbnailFileData?: Omit<BaseFileData, "file">;
}

import { z } from "zod";

const ZodFileType = z.union([
  z.literal("audio"),
  z.literal("video"),
  z.literal("image"),
  z.literal("file"),
  z.literal("base64"),
]);
export type FileType = z.infer<typeof ZodFileType>;

const ZodAudioFileMetadata = z.object({
  waveform: z.array(z.number()),
  duration: z.number(),
});
export type AudioFileMetadata = z.infer<typeof ZodAudioFileMetadata>;

const ZodVideoFileMetadata = z.object({
  duration: z.number(),
});
export type VideoFileMetadata = z.infer<typeof ZodVideoFileMetadata>;

const ZodBaseFileData = z.object({
  fileName: z.string(),
  mimeType: z.string(),
  size: z.number(),
  url: z.string(),
  fileType: ZodFileType,
  audioMetadata: ZodAudioFileMetadata.optional(),
  videoMetadata: ZodVideoFileMetadata.optional(),
  isCoverImage: z.boolean().optional(),
  base64Image: z.string().optional(),
});
type BaseFileData = z.infer<typeof ZodBaseFileData>;

export interface LocalFileData extends BaseFileData {
  file: File;
  thumbnailFileData?: BaseFileData & { file: File };
}

export const ZodRemoteFileData = z.object({
  ...ZodBaseFileData.shape,
  thumbnailFileData: ZodBaseFileData.optional(),
});
export type RemoteFileData = z.infer<typeof ZodRemoteFileData>;

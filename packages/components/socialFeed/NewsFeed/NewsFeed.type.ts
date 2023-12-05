import { z } from "zod";

import { Post } from "../../../api/feed/v1/feed";
import { PostResult } from "../../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import {
  LocalFileData,
  RemoteFileData,
  ZodRemoteFileData,
} from "../../../utils/types/files";

export enum PostCategory {
  Reaction,
  Comment,
  Normal,
  Article,
  Picture,
  Audio,
  VideoNote,
  Question,
  BriefForStableDiffusion,
  Flagged,
  MusicAudio,
  Video,
}

export interface NewArticleFormValues {
  title: string;
  hashtags: string[];
  mentions: string[];
  message: string;
  files?: LocalFileData[];
  gifs?: string[];
  nftStorageApiToken?: string;
  thumbnailImage?: LocalFileData;
  shortDescription?: string;
}

export interface NewPostFormValues {
  title: string;
  hashtags: string[];
  mentions: string[];
  message: string;
  files?: LocalFileData[];
  gifs?: string[];
}

export interface PostResultExtra extends PostResult {
  isInLocal?: boolean;
}
export interface PostExtra extends Post {
  isInLocal?: boolean;
}

// some files are malformed, we use this filter to get only valid file data
const MaybeFiles = z
  .array(z.unknown())
  .transform((as) =>
    as.filter(
      (a): a is RemoteFileData => ZodRemoteFileData.safeParse(a).success,
    ),
  );

export const ZodSocialFeedPostMetadata = z.object({
  title: z.string(),
  message: z.string(),
  files: MaybeFiles.optional(),
  gifs: z.array(z.string()).optional(),
  hashtags: z.array(z.string()),
  mentions: z.array(z.string()),
});
export type SocialFeedPostMetadata = z.infer<typeof ZodSocialFeedPostMetadata>;

export const ZodSocialFeedArticleMetadata = z.object({
  title: z.string(),
  shortDescription: z.string(),
  thumbnailImage: ZodRemoteFileData.optional(),
  message: z.string(),
  files: MaybeFiles.optional(),
  gifs: z.array(z.string()).optional(),
  hashtags: z.array(z.string()),
  mentions: z.array(z.string()),
});
export type SocialFeedArticleMetadata = z.infer<
  typeof ZodSocialFeedArticleMetadata
>;

export const ZodSocialFeedTrackMetadata = z.object({
  title: z.string(),
  description: z.string().optional(),
  audioFile: ZodRemoteFileData,
});

export type SocialFeedTrackMetadata = z.infer<
  typeof ZodSocialFeedTrackMetadata
>;

export const ZodSocialFeedVideoMetadata = z.object({
  title: z.string(),
  description: z.string().optional(),
  videoFile: ZodRemoteFileData,
});

export type SocialFeedVideoMetadata = z.infer<
  typeof ZodSocialFeedVideoMetadata
>;

export type ReplyToType = {
  username: string;
  yOffsetValue?: number;
  parentId?: string;
};

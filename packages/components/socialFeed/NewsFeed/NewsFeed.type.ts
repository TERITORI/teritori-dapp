import { z } from "zod";

import { Post } from "../../../api/feed/v1/feed";
import { PostResult } from "../../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import { LocalFileData, ZodRemoteFileData } from "../../../utils/types/files";

export enum PostCategory {
  Reaction,
  Comment,
  Normal,
  Article,
  Picture,
  Audio,
  Video,
  Question,
  BriefForStableDiffusion,
  Flagged,
}

export interface NewPostFormValues {
  title: string;
  hashtags: string[];
  mentions: string[];
  message: string;
  files?: LocalFileData[];
  gifs?: string[];
  nftStorageApiToken?: string;
  thumbnailImage?: LocalFileData;
  shortDescription: string;
}

export interface PostResultExtra extends PostResult {
  isInLocal?: boolean;
}
export interface PostExtra extends Post {
  isInLocal?: boolean;
}

export const ZodSocialFeedPostMetadata = z.object({
  title: z.string(),
  message: z.string(),
  files: z.array(ZodRemoteFileData).optional(),
  gifs: z.array(z.string()).optional(),
  hashtags: z.array(z.string()),
  mentions: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type SocialFeedPostMetadata = z.infer<typeof ZodSocialFeedPostMetadata>;

export const ZodSocialFeedArticleMetadata = z.object({
  title: z.string(),
  shortDescription: z.string(),
  thumbnailImage: ZodRemoteFileData.optional(),
  message: z.string(),
  files: z.array(ZodRemoteFileData).optional(),
  gifs: z.array(z.string()).optional(),
  hashtags: z.array(z.string()),
  mentions: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type SocialFeedArticleMetadata = z.infer<
  typeof ZodSocialFeedArticleMetadata
>;

export type ReplyToType = {
  username: string;
  yOffsetValue?: number;
  parentId?: string;
};

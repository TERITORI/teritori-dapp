import { Post } from "../../../api/feed/v1/feed";
import { PostResult } from "../../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import { LocalFileData, RemoteFileData } from "../../../utils/types/files";
import {z} from "zod";

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
  coverImage?: LocalFileData;
  shortDescription: string;
}

export interface PostResultExtra extends PostResult {
  isInLocal?: boolean;
}
export interface PostExtra extends Post {
  isInLocal?: boolean;
}

export interface SocialFeedMetadata {
  title: string;
  message: string;
  files?: RemoteFileData[];
  gifs?: string[];
  hashtags: string[];
  mentions: string[];
  createdAt: string;
  updatedAt: string;
  // openGraph?: OpenGraphType;
}

export const ZodSocialFeedArticleMetadata = z.object({
  title: z.string(),
  shortDescription: z.string(),
  coverImage: z.custom<RemoteFileData>().optional(),
  message: z.string(),
  files: z.custom<RemoteFileData[]>().optional(),
  gifs: z.array(z.string()).optional(),
  hashtags: z.array(z.string()),
  mentions: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type SocialFeedArticleMetadata = z.infer<typeof  ZodSocialFeedArticleMetadata>;


export type ReplyToType = {
  username: string;
  yOffsetValue?: number;
  parentId?: string;
};

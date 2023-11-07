import { Post } from "../../../api/feed/v1/feed";
import { PostResult } from "../../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import { LocalFileData, RemoteFileData } from "../../../utils/types/files";

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
  title?: string;
  hashtags: string[];
  mentions: string[];
  message: string;
  files?: LocalFileData[];
  gifs?: string[];
  nftStorageApiToken?: string;
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

export type ReplyToType = {
  username: string;
  yOffsetValue?: number;
  parentId?: string;
};

import { PostResult } from "../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import { OpenGraphType } from "../../hooks/feed/types";
import { LocalFileData, RemoteFileData } from "../../utils/types/feed";

export enum PostCategory {
  Reaction,
  Comment,
  Normal,
  Article,
  Picture,
  Audio,
  Video,
}

export interface NewPostFormValues {
  title?: string;
  hashtags: string[];
  message: string;
  files?: LocalFileData[];
  gifs?: string[];
  nftStorageApiToken?: string;
}

export interface PostResultExtra extends PostResult {
  isInLocal?: boolean;
}

export interface SocialFeedMetadata {
  title: string;
  message: string;
  files?: RemoteFileData[];
  hashtags: string[];
  createdAt: string;
  updatedAt: string;
  openGraph?: OpenGraphType;
}

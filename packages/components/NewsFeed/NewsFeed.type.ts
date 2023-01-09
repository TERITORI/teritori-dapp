import { PostResult } from "../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import { OpenGraphType } from "../../hooks/feed/types";

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
  message: string;
  files?: File[];
  gifs?: string[];
  hashtags: string[];
}

export interface PostResultExtra extends PostResult {
  isInLocal?: boolean;
}

export interface SocialFeedMetadata {
  title: string;
  message: string;
  fileURLs: string[];
  hashtags: string[];
  createdAt: string;
  updatedAt: string;
  openGraph?: OpenGraphType;
}

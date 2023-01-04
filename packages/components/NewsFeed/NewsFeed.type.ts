import { PostResult } from "../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";

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
  file?: File;
}

export interface PostResultExtra extends PostResult {
  isInLocal?: boolean;
}

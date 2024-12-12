import { z } from "zod";

import { LocalFileData, RemoteFileData, ZodRemoteFileData } from "./files";
import { Post } from "../../api/feed/v1/feed";
import { PostResult } from "../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";

export type OnPressReplyType = (replyTo: ReplyToType) => void;

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
  ArticleMarkdown,
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
  coverImage?: LocalFileData;
  shortDescription?: string;
  location?: CustomLatLngExpression;
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

export const ZodLatLngLiteral = z.object({
  lat: z.number(),
  lng: z.number(),
  // alt: z.number().optional()
});
export const ZodLatLngTuple = z.tuple([
  z.number(),
  z.number(),
  // I got the error "too_small" with z.number().optional(). I don't know why because it's optional. Whatever, we don't need altitude
  // z.number().optional()
]);

export const ZodLatLngExpression = z.union([ZodLatLngLiteral, ZodLatLngTuple]);
export type CustomLatLngExpression = z.infer<typeof ZodLatLngExpression>;

export const zodSocialFeedCommonMetadata = z.object({
  title: z.string(),
  premium: z.number().int().gte(0).optional(),
  location: ZodLatLngExpression.optional(),
});

export type SocialFeedCommonMetadata = z.infer<
  typeof zodSocialFeedCommonMetadata
>;

export const ZodSocialFeedPostMetadata = z.object({
  message: z.string(),
  files: MaybeFiles.optional(),
  gifs: z.array(z.string()).optional(),
  hashtags: z.array(z.string()),
  mentions: z.array(z.string()),
  ...zodSocialFeedCommonMetadata.shape,
});
export type SocialFeedPostMetadata = z.infer<typeof ZodSocialFeedPostMetadata>;

export const ZodSocialFeedArticleMetadata = z.object({
  shortDescription: z.string(),
  thumbnailImage: ZodRemoteFileData.optional(),
  coverImage: ZodRemoteFileData.optional(),
  message: z.string(),
  files: MaybeFiles.optional(),
  gifs: z.array(z.string()).optional(),
  hashtags: z.array(z.string()),
  mentions: z.array(z.string()),
  ...zodSocialFeedCommonMetadata.shape,
});
export type SocialFeedArticleMetadata = z.infer<
  typeof ZodSocialFeedArticleMetadata
>;

export const ZodSocialFeedTrackMetadata = z.object({
  description: z.string().optional(),
  audioFile: ZodRemoteFileData,
  ...zodSocialFeedCommonMetadata.shape,
});

export type SocialFeedTrackMetadata = z.infer<
  typeof ZodSocialFeedTrackMetadata
>;

export const ZodSocialFeedVideoMetadata = z.object({
  description: z.string().optional(),
  videoFile: ZodRemoteFileData,
  ...zodSocialFeedCommonMetadata.shape,
});

export type SocialFeedVideoMetadata = z.infer<
  typeof ZodSocialFeedVideoMetadata
>;

export type ReplyToType = {
  username: string;
  yOffsetValue?: number;
  parentId?: string;
};

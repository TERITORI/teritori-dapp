import { z } from "zod";

import { GIF_MIME_TYPE } from "./mime";
import { HASHTAG_REGEX, MENTION_REGEX, URL_REGEX } from "./regex";
import { zodTryParseJSON } from "./sanitize";
import { redDefault } from "./style/colors";
import { LocalFileData } from "./types/files";
import flagSVG from "../../assets/icons/notification.svg";
import { Post, Reaction } from "../api/feed/v1/feed";
import {
  PostExtra,
  PostResultExtra,
} from "../components/socialFeed/NewsFeed/NewsFeed.type";
import { TabDefinition } from "../components/tabs/Tabs";
import { PostResult } from "../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import { getUserId } from "../networks";

export const DEFAULT_NAME = "Anon";
export const DEFAULT_USERNAME = "anonymous";
export const SOCIAL_FEED_ARTICLE_MIN_CHARS_LIMIT = 2500;
export const NB_ROWS_SHOWN_IN_PREVIEW = 5;
export const ARTICLE_MAX_WIDTH = 1046;
export const ARTICLE_COVER_IMAGE_HEIGHT = 300;
export const ARTICLE_THUMBNAIL_IMAGE_HEIGHT = 252;
export const BASE_POST: Post = {
  identifier: "",
  category: 0,
  authorId: "",
  metadata: "",
  isDeleted: false,
  parentPostIdentifier: "",
  subPostLength: 0,
  createdAt: 0,
  tipAmount: 0,
  reactions: [],
};

export const getUpdatedReactions = (reactions: Reaction[], icon: string) => {
  const hasIcon = reactions.find((r) => r.icon === icon);
  if (hasIcon) {
    reactions = reactions.map((rect) => {
      if (rect.icon === icon) {
        return { icon, count: ++rect.count, ownState: true };
      }
      return rect;
    });
  } else {
    reactions = [...reactions, { icon, count: 1, ownState: true }];
  }

  return reactions;
};

export const feedsTabItems: { [key: string]: TabDefinition } = {
  "": {
    name: "Jungle News Feed",
  },
  music: {
    name: "Music Feed",
  },
  pics: {
    name: "Pics Feed",
  },
  videos: {
    name: "Videos Feed",
  },
  articles: {
    name: "Articles Feed",
  },
  governance: {
    name: "Governance Feed",
    disabled: true,
  },
  moderationDAO: {
    name: "Moderation DAO",
    iconSVG: flagSVG,
    iconColor: redDefault,
  },
};

export const mentionMatch = (text: string) =>
  text.match(new RegExp(MENTION_REGEX, "g"));
export const hashtagMatch = (text: string) =>
  text.match(new RegExp(HASHTAG_REGEX, "g"));
export const urlMatch = (text: string) =>
  text.match(new RegExp(URL_REGEX, "g"));

export const postResultToPost = (
  networkId: string,
  postResult: PostResultExtra | PostResult,
) => {
  const metadata = zodTryParseJSON(
    z.object({ createdAt: z.string() }),
    postResult.metadata,
  );

  const chainReactions = postResult.reactions;
  const postReactions: Reaction[] = chainReactions.map((reaction) => ({
    icon: reaction.icon,
    count: reaction.count,
    ownState: false, // FIXME: find a way to get the user's reaction state from on-chain post
  }));

  const post: Post = {
    category: postResult.category,
    isDeleted: postResult.deleted,
    identifier: postResult.identifier,
    metadata: postResult.metadata,
    parentPostIdentifier: postResult.parent_post_identifier || "",
    subPostLength: postResult.sub_post_length,
    reactions: postReactions,
    authorId: getUserId(networkId, postResult.post_by),
    createdAt: metadata ? Date.parse(metadata.createdAt) / 1000 : 0,
    tipAmount: parseFloat(postResult.tip_amount),
  };
  if ("isInLocal" in postResult) {
    return { ...post, isInLocal: postResult.isInLocal } as PostExtra;
  }
  return post;
};

export const replaceFileInArray = (
  files: LocalFileData[],
  newFile: LocalFileData,
) => {
  const oldFile = files.find((file) => file.url === newFile.url);
  if (!oldFile) return;
  const i = files.indexOf(oldFile);
  const filesClone = [...files];
  filesClone.splice(i, 1, newFile);
  return filesClone;
};

export const removeFileFromArray = (
  files: LocalFileData[],
  damnedFile: LocalFileData,
) => {
  return files.filter((file) => file.url !== damnedFile.url);
};

export const convertGIFToLocalFileType = (
  gif: string,
  fileName: string,
): LocalFileData => ({
  file: new File([], fileName),
  fileName,
  mimeType: GIF_MIME_TYPE,
  size: 120,
  url: gif,
  fileType: "image",
});

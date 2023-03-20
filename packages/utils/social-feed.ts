import { Post, Reaction } from "../api/feed/v1/feed";
import { PostCategory } from "../components/socialFeed/NewsFeed/NewsFeed.type";
import { PostResult } from "../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import { getUserId } from "../networks";
import { mustGetFeedClient } from "./backend";
import { HASHTAG_REGEX, MENTION_REGEX, URL_REGEX } from "./regex";
import { LocalFileData } from "./types/feed";

export const DEFAULT_NAME = "Anon";
export const DEFAULT_USERNAME = "anonymous";
export const SOCIAL_FEED_ARTICLE_MIN_CHARS_LIMIT = 2500;

export const getUpdatedReactions = (reactions: Reaction[], icon: string) => {
  const hasIcon = reactions.find((r) => r.icon === icon);
  if (hasIcon) {
    reactions = reactions.map((rect) => {
      if (rect.icon === icon) {
        return { icon, count: ++rect.count };
      }
      return rect;
    });
  } else {
    reactions = [...reactions, { icon, count: 1 }];
  }

  return reactions;
};

export const feedsTabItems = {
  all: {
    name: "Jungle News Feed",
  },
  sounds: {
    name: "Sound Feed",
  },
  videosPics: {
    name: "Video & Pic Feed",
  },
  articles: {
    name: "Articles Feed",
  },
  governance: {
    name: "Governance Feed ",
    disabled: true,
  },
};

// The Social Feed tabs doesn't fully correspond to the Posts categories, so we need to parse like this
export const feedTabToCategories = (tab: keyof typeof feedsTabItems) => {
  switch (tab) {
    case "sounds":
      return [PostCategory.Audio];
    case "videosPics":
      return [PostCategory.Picture, PostCategory.Video];
    case "articles":
      return [PostCategory.Article];
    default:
      return [];
  }
};

export const mentionMatch = (text: string) =>
  text.match(new RegExp(MENTION_REGEX, "g"));
export const hashtagMatch = (text: string) =>
  text.match(new RegExp(HASHTAG_REGEX, "g"));
export const urlMatch = (text: string) =>
  text.match(new RegExp(URL_REGEX, "g"));

export const postResultToPost = (networkId: string, postResult: PostResult) => {
  return {
    category: postResult.category,
    isDeleted: postResult.deleted,
    identifier: postResult.identifier,
    metadata: postResult.metadata,
    parentPostIdentifier: postResult.parent_post_identifier,
    subPostLength: postResult.sub_post_length,
    reactions: postResult.reactions,
    // TODO: We need to parse, because we're using Post[] from social-feed API and PostResult[] from social-feed contract
    createdBy: getUserId(networkId, postResult.post_by),
    createdAt: JSON.parse(postResult.metadata).createdAt,
  } as Post;
};

export const generateIpfsKey = async (networkId: string, userId: string) => {
  try {
    const backendClient = mustGetFeedClient(networkId);
    const response = await backendClient.IPFSKey({ userId });
    return response.jwt;
  } catch (e) {
    console.error("ERROR WHILE GENERATING IPFSKey : ", e);
    return undefined;
  }
};

export const replaceFileInArray = (
  files: LocalFileData[],
  newFile: LocalFileData
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
  damnedFile: LocalFileData
) => {
  return files.filter((file) => file.url !== damnedFile.url);
};

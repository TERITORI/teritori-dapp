import { Post, Reaction } from "../api/feed/v1/feed";
import { PostCategory } from "../components/socialFeed/NewsFeed/NewsFeed.type";
import { PostResult } from "../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import { getUserId } from "../networks";
import { HANDLE_REGEX, URL_REGEX } from "./regex";

export const DEFAULT_NAME = "Anon";
export const DEFAULT_USERNAME = "anonymous";
export const SOCIAL_FEED_ARTICLE_MIN_CHAR_LIMIT = 2500;

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
  chatBot: {
    name: "AI ChatRoom",
  },
  stableDiff: {
    name: "AI Image Generation",
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
  text.match(new RegExp(HANDLE_REGEX, "g"));
export const hashMatch = (text: string) => text.match(/#\S+/g);
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

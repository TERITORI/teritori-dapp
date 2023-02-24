import { cloneDeep } from "lodash";

import { PostResult } from "../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";

export const DEFAULT_NAME = "Anon";
export const DEFAULT_USERNAME = "anonymous";
export const SOCIAL_FEED_ARTICLE_MIN_CHAR_LIMIT = 2500;

export const getUpdatedReactions = (postResult: PostResult, icon: string) => {
  const copyLocalComment = cloneDeep(postResult);
  const hasIcon = copyLocalComment.reactions.find((r) => r.icon === icon);
  let reactions = [...copyLocalComment.reactions];
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

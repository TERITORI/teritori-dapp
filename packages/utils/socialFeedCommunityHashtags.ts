import _ from "lodash";

import { purpleDefault } from "./style/colors";

export const socialFeedCommunityHashtags = [
  { hashtag: "Gnoland", color: purpleDefault },
];

export const getCommunityHashtag = (hashtags: string[]) => {
  const communityHashtags = _.intersection(
    socialFeedCommunityHashtags.map((item) => item.hashtag.toLowerCase()),
    hashtags.map((item) => item.replace("#", ""))
  );

  return socialFeedCommunityHashtags.find(
    (item) => item.hashtag.toLowerCase() === communityHashtags[0]
  );
};

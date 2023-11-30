import React, { FC, useCallback } from "react";

import { UPPHeader } from "./components/UPPHeader";
import { PostsRequest } from "../../api/feed/v1/feed";
import {
  ScreenContainer,
  ScreenContainerProps,
} from "../../components/ScreenContainer";
import { NewsFeed } from "../../components/socialFeed/NewsFeed/NewsFeed";
import { PostCategory } from "../../components/socialFeed/NewsFeed/NewsFeed.type";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { parseUserId } from "../../networks";

export const FeedVideosUPPScreen: FC<{
  userId: string;
  screenContainerOtherProps: Partial<ScreenContainerProps>;
}> = ({ userId, screenContainerOtherProps }) => {
  const [, userAddress] = parseUserId(userId);
  const selectedWallet = useSelectedWallet();
  const userInfo = useNSUserInfo(userId);

  const feedRequestUserVideos: Partial<PostsRequest> = {
    filter: {
      categories: [PostCategory.Video],
      user: userId,
      mentions: [],
      hashtags: [],
    },
    limit: 10,
    offset: 0,
    queryUserId: selectedWallet?.userId,
  };

  const Header = useCallback(
    () => <UPPHeader userId={userId} selectedTab="feedVideos" />,
    [userId],
  );

  return (
    <ScreenContainer
      key={`FeedVideosUPP ${userId}`} // this key is to reset the screen state when the id changes
      noScroll
      {...screenContainerOtherProps}
    >
      <NewsFeed
        isVideos
        disablePosting={
          !selectedWallet?.connected || selectedWallet?.userId === userId
        }
        Header={Header}
        additionalMention={
          selectedWallet?.address !== userAddress
            ? userInfo?.metadata.tokenId || userAddress
            : undefined
        }
        req={feedRequestUserVideos}
      />
    </ScreenContainer>
  );
};

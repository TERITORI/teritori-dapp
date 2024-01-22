import React, { FC } from "react";

import { PostsRequest } from "../../../api/feed/v1/feed";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { PostCategory } from "../../../components/socialFeed/NewsFeed/NewsFeed.type";
import { FeedVideosList } from "../../../components/video/FeedVideosList";
import { useNSUserInfo } from "../../../hooks/useNSUserInfo";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { parseUserId } from "../../../networks";
import { UppTabKeys } from "../../../utils/upp";
import { UppTabScreenProps } from "../UserPublicProfileScreen";
import { UPPHeader } from "../components/UPPHeader";
import { UPPScreenContentWrapper } from "../components/UPPScreenContentWrapper";

export const VideosUPPScreen: FC<UppTabScreenProps> = ({
  userId,
  screenContainerOtherProps,
}) => {
  const [, userAddress] = parseUserId(userId);
  const selectedWallet = useSelectedWallet();
  const userInfo = useNSUserInfo(userId);
  const userName =
    userInfo?.metadata.public_name || userInfo?.metadata.tokenId || userAddress;
  const isCurrentUser = userId === selectedWallet?.userId;

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

  return (
    <ScreenContainer
      key={`${UppTabKeys.videos} ${userId}`} // this key is to reset the screen state when the id changes
      {...screenContainerOtherProps}
    >
      <UPPScreenContentWrapper>
        <UPPHeader userId={userId} selectedTab={UppTabKeys.videos} />
        <FeedVideosList
          title={isCurrentUser ? "Your videos" : "Videos by " + userName}
          allowUpload={isCurrentUser}
          req={feedRequestUserVideos}
        />
      </UPPScreenContentWrapper>
    </ScreenContainer>
  );
};

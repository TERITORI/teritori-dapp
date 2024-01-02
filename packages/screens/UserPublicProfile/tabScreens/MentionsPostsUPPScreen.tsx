import React, { FC, useCallback, useMemo } from "react";

import { PostsRequest } from "../../../api/feed/v1/feed";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { NewsFeed } from "../../../components/socialFeed/NewsFeed/NewsFeed";
import { useNSUserInfo } from "../../../hooks/useNSUserInfo";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { parseUserId } from "../../../networks";
import { UppTabKeys } from "../../../utils/upp";
import { UppTabScreenProps } from "../UserPublicProfileScreen";
import { UPPHeader } from "../components/UPPHeader";

export const MentionsPostsUPPScreen: FC<UppTabScreenProps> = ({
  userId,
  screenContainerOtherProps,
}) => {
  const [, userAddress] = parseUserId(userId);
  const selectedWallet = useSelectedWallet();
  const userInfo = useNSUserInfo(userId);

  const feedRequestMentionsPosts: Partial<PostsRequest> = useMemo(() => {
    return {
      filter: {
        user: "",
        mentions: userInfo?.metadata.tokenId
          ? // The user can be mentioned by his NS name OR his address, so we use both in this filter
            [`@${userAddress}`, `@${userInfo?.metadata.tokenId}`]
          : // Btw, is the user has no NS name, we use his address in this filter
            [`@${userAddress}`],
        categories: [],
        hashtags: [],
      },
      limit: 10,
      offset: 0,
    };
  }, [userInfo?.metadata.tokenId, userAddress]);

  const Header = useCallback(
    () => <UPPHeader userId={userId} selectedTab={UppTabKeys.mentionsPosts} />,
    [userId],
  );

  return (
    <ScreenContainer
      key={`${UppTabKeys.mentionsPosts} ${userId}`} // this key is to reset the screen state when the id changes
      noScroll
      {...screenContainerOtherProps}
    >
      <NewsFeed
        disablePosting={
          !selectedWallet?.connected || selectedWallet?.userId === userId
        }
        Header={Header}
        additionalMention={
          selectedWallet?.address !== userAddress
            ? userInfo?.metadata.tokenId || userAddress
            : undefined
        }
        req={feedRequestMentionsPosts}
      />
    </ScreenContainer>
  );
};

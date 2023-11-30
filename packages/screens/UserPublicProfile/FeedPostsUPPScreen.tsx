import React, { FC, useCallback, useMemo } from "react";

import { UPPHeader } from "./components/UPPHeader";
import { PostsRequest } from "../../api/feed/v1/feed";
import {
  ScreenContainer,
  ScreenContainerProps,
} from "../../components/ScreenContainer";
import { NewsFeed } from "../../components/socialFeed/NewsFeed/NewsFeed";
import { useIsDAO } from "../../hooks/cosmwasm/useCosmWasmContractInfo";
import { useIsDAOMember } from "../../hooks/dao/useDAOMember";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { parseUserId } from "../../networks";

export const FeedPostsUPPScreen: FC<{
  userId: string;
  screenContainerOtherProps: Partial<ScreenContainerProps>;
}> = ({ userId, screenContainerOtherProps }) => {
  const [, userAddress] = parseUserId(userId);
  const selectedWallet = useSelectedWallet();
  const userInfo = useNSUserInfo(userId);
  const { isDAO } = useIsDAO(userId);
  const { isDAOMember } = useIsDAOMember(userId, selectedWallet?.userId, isDAO);

  const feedRequestUserPosts: Partial<PostsRequest> = useMemo(() => {
    return {
      filter: {
        user: userId,
        mentions: [],
        categories: [],
        hashtags: [],
      },
      limit: 10,
      offset: 0,
    };
  }, [userId]);

  const Header = useCallback(
    () => <UPPHeader userId={userId} selectedTab="feedPosts" />,
    [userId],
  );

  return (
    <ScreenContainer
      key={`FeedPostsUPP ${userId}`} // this key is to reset the screen state when the id changes
      noScroll
      {...screenContainerOtherProps}
    >
      <NewsFeed
        disablePosting={
          isDAO ? !isDAOMember : selectedWallet?.userId !== userId
        }
        daoId={isDAO ? userId : undefined}
        Header={Header}
        additionalMention={
          isDAO
            ? undefined
            : selectedWallet?.address !== userAddress
              ? userInfo?.metadata.tokenId || userAddress
              : undefined
        }
        req={feedRequestUserPosts}
      />
    </ScreenContainer>
  );
};

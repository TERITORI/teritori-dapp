import React, { FC, useCallback, useMemo } from "react";

import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { UppTabScreenProps } from "../UserPublicProfileScreen";
import { UPPHeader } from "../components/UPPHeader";

import { PostsRequest } from "@/api/feed/v1/feed";
import { ScreenContainer } from "@/components/ScreenContainer";
import { NewsFeed } from "@/components/socialFeed/NewsFeed/NewsFeed";
import { useIsDAO } from "@/hooks/cosmwasm/useCosmWasmContractInfo";
import { useIsDAOMember } from "@/hooks/dao/useDAOMember";
import { useNSUserInfo } from "@/hooks/useNSUserInfo";
import { parseUserId } from "@/networks";
import { DeepPartial } from "@/utils/typescript";
import { UppTabKeys } from "@/utils/upp";

export const PostsUPPScreen: FC<UppTabScreenProps> = ({
  userId,
  screenContainerOtherProps,
}) => {
  const [, userAddress] = parseUserId(userId);
  const selectedWallet = useSelectedWallet();
  const userInfo = useNSUserInfo(userId);
  const { isDAO } = useIsDAO(userId);
  const { isDAOMember } = useIsDAOMember(userId, selectedWallet?.userId, isDAO);

  const feedRequestUserPosts: DeepPartial<PostsRequest> = useMemo(() => {
    return {
      filter: {
        user: userId,
        premiumLevelMax: -1,
      },
      limit: 10,
    };
  }, [userId]);

  const Header = useCallback(
    () => <UPPHeader userId={userId} selectedTab={UppTabKeys.posts} />,
    [userId],
  );

  return (
    <ScreenContainer
      key={`${UppTabKeys.posts} ${userId}`} // this key is to reset the screen state when the id changes
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

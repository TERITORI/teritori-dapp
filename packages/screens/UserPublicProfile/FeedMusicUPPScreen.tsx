import React, { FC } from "react";

import { UPPHeader } from "./components/UPPHeader";
import { UPPScreenContentWrapper } from "./components/UPPScreenContentWrapper";
import {
  ScreenContainer,
  ScreenContainerProps,
} from "../../components/ScreenContainer";
import { MusicList } from "../../components/music/MusicList";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { parseUserId } from "../../networks";

export const FeedMusicUPPScreen: FC<{
  userId: string;
  screenContainerOtherProps: Partial<ScreenContainerProps>;
}> = ({ userId, screenContainerOtherProps }) => {
  const selectedWallet = useSelectedWallet();
  const [, userAddress] = parseUserId(userId);
  const userInfo = useNSUserInfo(userId);
  const userName =
    userInfo?.metadata.public_name || userInfo?.metadata.tokenId || userAddress;
  const isCurrentUser = userId === selectedWallet?.userId;

  return (
    <ScreenContainer
      key={`FeedMusicUPP ${userId}`} // this key is to reset the screen state when the id changes
      {...screenContainerOtherProps}
    >
      <UPPScreenContentWrapper>
        <UPPHeader userId={userId} selectedTab="feedMusic" />
        <MusicList
          title={isCurrentUser ? "Your music" : "Music by " + userName}
          authorId={userId}
          allowUpload={isCurrentUser}
        />
      </UPPScreenContentWrapper>
    </ScreenContainer>
  );
};

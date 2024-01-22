import React, { FC } from "react";

import { ScreenContainer } from "../../../components/ScreenContainer";
import { FeedMusicList } from "../../../components/music/FeedMusicList";
import { useNSUserInfo } from "../../../hooks/useNSUserInfo";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { parseUserId } from "../../../networks";
import { UppTabKeys } from "../../../utils/upp";
import { UppTabScreenProps } from "../UserPublicProfileScreen";
import { UPPHeader } from "../components/UPPHeader";
import { UPPScreenContentWrapper } from "../components/UPPScreenContentWrapper";

export const MusicUPPScreen: FC<UppTabScreenProps> = ({
  userId,
  screenContainerOtherProps,
}) => {
  const selectedWallet = useSelectedWallet();
  const [, userAddress] = parseUserId(userId);
  const userInfo = useNSUserInfo(userId);
  const userName =
    userInfo?.metadata.public_name || userInfo?.metadata.tokenId || userAddress;
  const isCurrentUser = userId === selectedWallet?.userId;

  return (
    <ScreenContainer
      key={`${UppTabKeys.music} ${userId}`} // this key is to reset the screen state when the id changes
      {...screenContainerOtherProps}
    >
      <UPPScreenContentWrapper>
        <UPPHeader userId={userId} selectedTab={UppTabKeys.music} />
        <FeedMusicList
          title={isCurrentUser ? "Your music" : "Music by " + userName}
          authorId={userId}
          allowUpload={isCurrentUser}
        />
      </UPPScreenContentWrapper>
    </ScreenContainer>
  );
};

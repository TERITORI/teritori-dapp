import React, { FC } from "react";

import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { UppTabScreenProps } from "../UserPublicProfileScreen";
import { UPPHeader } from "../components/UPPHeader";
import { UPPScreenContentWrapper } from "../components/UPPScreenContentWrapper";

import { ScreenContainer } from "@/components/ScreenContainer";
import { FeedMusicList } from "@/components/music/FeedMusicList";
import { useNSUserInfo } from "@/hooks/useNSUserInfo";
import { parseUserId } from "@/networks";
import { UppTabKeys } from "@/utils/upp";

export const MusicUPPScreen: FC<UppTabScreenProps> = ({
  userId,
  screenContainerOtherProps,
}) => {
  const selectedWallet = useSelectedWallet();
  const [network, userAddress] = parseUserId(userId);
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
          networkId={network?.id}
          authorId={userId}
          allowUpload={isCurrentUser}
        />
      </UPPScreenContentWrapper>
    </ScreenContainer>
  );
};

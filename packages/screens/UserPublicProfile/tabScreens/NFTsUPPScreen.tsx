import React, { FC } from "react";

import { ScreenContainer } from "../../../components/ScreenContainer";
import { UppTabKeys } from "../../../utils/upp";
import { UppTabScreenProps } from "../UserPublicProfileScreen";
import { UPPHeader } from "../components/UPPHeader";
import { UPPNFTs } from "../components/UPPNFTs";
import { UPPScreenContentWrapper } from "../components/UPPScreenContentWrapper";

export const NFTsUPPScreen: FC<UppTabScreenProps> = ({
  userId,
  screenContainerOtherProps,
}) => {
  return (
    <ScreenContainer
      key={`${UppTabKeys.nfts} ${userId}`} // this key is to reset the screen state when the id changes
      {...screenContainerOtherProps}
    >
      <UPPScreenContentWrapper>
        <UPPHeader userId={userId} selectedTab={UppTabKeys.nfts} />
        <UPPNFTs userId={userId} />
      </UPPScreenContentWrapper>
    </ScreenContainer>
  );
};

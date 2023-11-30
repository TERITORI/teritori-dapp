import React, { FC } from "react";

import { UPPHeader } from "./components/UPPHeader";
import { UPPNFTs } from "./components/UPPNFTs";
import { UPPScreenContentWrapper } from "./components/UPPScreenContentWrapper";
import {
  ScreenContainer,
  ScreenContainerProps,
} from "../../components/ScreenContainer";

export const NFTsUPPScreen: FC<{
  userId: string;
  screenContainerOtherProps: Partial<ScreenContainerProps>;
}> = ({ userId, screenContainerOtherProps }) => {
  return (
    <ScreenContainer
      key={`NFTsUPP ${userId}`} // this key is to reset the screen state when the id changes
      {...screenContainerOtherProps}
    >
      <UPPScreenContentWrapper>
        <UPPHeader userId={userId} selectedTab="nfts" />
        <UPPNFTs userId={userId} />
      </UPPScreenContentWrapper>
    </ScreenContainer>
  );
};

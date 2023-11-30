import React, { FC } from "react";

import { UPPHeader } from "./components/UPPHeader";
import { UPPScreenContentWrapper } from "./components/UPPScreenContentWrapper";
import {
  ScreenContainer,
  ScreenContainerProps,
} from "../../components/ScreenContainer";
import { DAOProposals } from "../../components/dao/DAOProposals";

export const DAOProposalsUPPScreen: FC<{
  userId: string;
  screenContainerOtherProps: Partial<ScreenContainerProps>;
}> = ({ userId, screenContainerOtherProps }) => {
  return (
    <ScreenContainer
      key={`DAOProposalsUPP ${userId}`} // this key is to reset the screen state when the id changes
      {...screenContainerOtherProps}
    >
      <UPPScreenContentWrapper>
        <UPPHeader userId={userId} selectedTab="daosProposals" />
        <DAOProposals daoId={userId} />
      </UPPScreenContentWrapper>
    </ScreenContainer>
  );
};

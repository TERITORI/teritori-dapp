import React, { FC } from "react";

import { ScreenContainer } from "../../../components/ScreenContainer";
import { DAOProposals } from "../../../components/dao/DAOProposals";
import { UppTabKeys } from "../../../utils/upp";
import { UppTabScreenProps } from "../UserPublicProfileScreen";
import { UPPHeader } from "../components/UPPHeader";
import { UPPScreenContentWrapper } from "../components/UPPScreenContentWrapper";

export const ProposalsUPPScreen: FC<UppTabScreenProps> = ({
  userId,
  screenContainerOtherProps,
}) => {
  return (
    <ScreenContainer
      key={`${UppTabKeys.proposals} ${userId}`} // this key is to reset the screen state when the id changes
      {...screenContainerOtherProps}
    >
      <UPPScreenContentWrapper>
        <UPPHeader userId={userId} selectedTab={UppTabKeys.proposals} />
        <DAOProposals daoId={userId} />
      </UPPScreenContentWrapper>
    </ScreenContainer>
  );
};

import React, { FC } from "react";

import { ScreenContainer } from "../../../components/ScreenContainer";
import { DAOMembers } from "../../../components/dao/DAOMembers";
import { UppTabKeys } from "../../../utils/upp";
import { UppTabScreenProps } from "../UserPublicProfileScreen";
import { UPPHeader } from "../components/UPPHeader";
import { UPPScreenContentWrapper } from "../components/UPPScreenContentWrapper";

export const MembersUPPScreen: FC<UppTabScreenProps> = ({
  userId,
  screenContainerOtherProps,
}) => {
  return (
    <ScreenContainer
      key={`${UppTabKeys.members} ${userId}`} // this key is to reset the screen state when the id changes
      {...screenContainerOtherProps}
    >
      <UPPScreenContentWrapper>
        <UPPHeader userId={userId} selectedTab={UppTabKeys.members} />
        <DAOMembers daoId={userId} />
      </UPPScreenContentWrapper>
    </ScreenContainer>
  );
};

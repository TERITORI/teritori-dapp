import React, { FC } from "react";

import { ScreenContainer } from "../../../components/ScreenContainer";
import { DAOsList } from "../../../components/dao/DAOsList";
import { parseUserId } from "../../../networks";
import { UppTabKeys } from "../../../utils/upp";
import { UppTabScreenProps } from "../UserPublicProfileScreen";
import { UPPHeader } from "../components/UPPHeader";
import { UPPScreenContentWrapper } from "../components/UPPScreenContentWrapper";

export const DAOsUPPScreen: FC<UppTabScreenProps> = ({
  userId,
  screenContainerOtherProps,
}) => {
  const [network, userAddress] = parseUserId(userId);

  return (
    <ScreenContainer
      key={`${UppTabKeys.daos} ${userId}`} // this key is to reset the screen state when the id changes
      {...screenContainerOtherProps}
    >
      <UPPScreenContentWrapper>
        <UPPHeader userId={userId} selectedTab={UppTabKeys.daos} />
        <DAOsList
          req={{ networkId: network?.id, memberAddress: userAddress }}
        />
      </UPPScreenContentWrapper>
    </ScreenContainer>
  );
};

import React, { FC } from "react";

import { UPPHeader } from "./components/UPPHeader";
import { UPPScreenContentWrapper } from "./components/UPPScreenContentWrapper";
import {
  ScreenContainer,
  ScreenContainerProps,
} from "../../components/ScreenContainer";
import { DAOsList } from "../../components/dao/DAOsList";
import { parseUserId } from "../../networks";

export const DAOsUPPScreen: FC<{
  userId: string;
  screenContainerOtherProps: Partial<ScreenContainerProps>;
}> = ({ userId, screenContainerOtherProps }) => {
  const [network, userAddress] = parseUserId(userId);

  return (
    <ScreenContainer
      key={`DAOsUPP ${userId}`} // this key is to reset the screen state when the id changes
      {...screenContainerOtherProps}
    >
      <UPPScreenContentWrapper>
        <UPPHeader userId={userId} selectedTab="daos" />
        <DAOsList
          req={{ networkId: network?.id, memberAddress: userAddress }}
        />
      </UPPScreenContentWrapper>
    </ScreenContainer>
  );
};

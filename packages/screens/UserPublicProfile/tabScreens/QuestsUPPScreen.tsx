import React, { FC } from "react";

import { Quests } from "../../../components/Quests";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { UppTabKeys } from "../../../utils/upp";
import { UppTabScreenProps } from "../UserPublicProfileScreen";
import { UPPHeader } from "../components/UPPHeader";
import { UPPScreenContentWrapper } from "../components/UPPScreenContentWrapper";

export const QuestsUPPScreen: FC<UppTabScreenProps> = ({
  userId,
  screenContainerOtherProps,
}) => {
  return (
    <ScreenContainer
      key={`${UppTabKeys.quests} ${userId}`} // this key is to reset the screen state when the id changes
      {...screenContainerOtherProps}
    >
      <UPPScreenContentWrapper>
        <UPPHeader userId={userId} selectedTab={UppTabKeys.quests} />
        <Quests userId={userId} />
      </UPPScreenContentWrapper>
    </ScreenContainer>
  );
};

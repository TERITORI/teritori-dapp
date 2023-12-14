import React, { FC } from "react";

import { ScreenContainer } from "../../../components/ScreenContainer";
import { GnoDemo } from "../../../components/dao/GnoDemo";
import { UppTabKeys } from "../../../utils/upp";
import { UppTabScreenProps } from "../UserPublicProfileScreen";
import { UPPHeader } from "../components/UPPHeader";
import { UPPScreenContentWrapper } from "../components/UPPScreenContentWrapper";

export const GnoDemoUPPScreen: FC<UppTabScreenProps> = ({
  userId,
  screenContainerOtherProps,
}) => {
  return (
    <ScreenContainer
      key={`${UppTabKeys.gnoDemo} ${userId}`} // this key is to reset the screen state when the id changes
      {...screenContainerOtherProps}
    >
      <UPPScreenContentWrapper>
        <UPPHeader userId={userId} selectedTab={UppTabKeys.gnoDemo} />
        <GnoDemo daoId={userId} />
      </UPPScreenContentWrapper>
    </ScreenContainer>
  );
};

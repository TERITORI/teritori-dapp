import React, { FC } from "react";

import { ScreenContainer } from "../../../components/ScreenContainer";
import { UppTabKeys } from "../../../utils/upp";
import { Assets } from "../../WalletManager/Assets";
import { UppTabScreenProps } from "../UserPublicProfileScreen";
import { UPPHeader } from "../components/UPPHeader";
import { UPPScreenContentWrapper } from "../components/UPPScreenContentWrapper";

export const FundsUPPScreen: FC<UppTabScreenProps> = ({
  userId,
  screenContainerOtherProps,
}) => {
  return (
    <ScreenContainer
      key={`${UppTabKeys.funds} ${userId}`} // this key is to reset the screen state when the id changes
      {...screenContainerOtherProps}
    >
      <UPPScreenContentWrapper>
        <UPPHeader userId={userId} selectedTab={UppTabKeys.funds} />
        <Assets userId={userId} readOnly />
      </UPPScreenContentWrapper>
    </ScreenContainer>
  );
};

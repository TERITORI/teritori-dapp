import React, { FC } from "react";

import { UPPHeader } from "./components/UPPHeader";
import { UPPScreenContentWrapper } from "./components/UPPScreenContentWrapper";
import {
  ScreenContainer,
  ScreenContainerProps,
} from "../../components/ScreenContainer";
import { Assets } from "../WalletManager/Assets";

export const FundsUPPScreen: FC<{
  userId: string;
  screenContainerOtherProps: Partial<ScreenContainerProps>;
}> = ({ userId, screenContainerOtherProps }) => {
  return (
    <ScreenContainer
      key={`FundsUPP ${userId}`} // this key is to reset the screen state when the id changes
      {...screenContainerOtherProps}
    >
      <UPPScreenContentWrapper>
        <UPPHeader userId={userId} selectedTab="funds" />
        <Assets userId={userId} readOnly />
      </UPPScreenContentWrapper>
    </ScreenContainer>
  );
};

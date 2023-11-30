import React, { FC } from "react";

import { UPPHeader } from "./components/UPPHeader";
import { UPPScreenContentWrapper } from "./components/UPPScreenContentWrapper";
import {
  ScreenContainer,
  ScreenContainerProps,
} from "../../components/ScreenContainer";
import { GnoDemo } from "../../components/dao/GnoDemo";

export const GnoDemoUPPScreen: FC<{
  userId: string;
  screenContainerOtherProps: Partial<ScreenContainerProps>;
}> = ({ userId, screenContainerOtherProps }) => {
  return (
    <ScreenContainer
      key={`GnoDemoUPP ${userId}`} // this key is to reset the screen state when the id changes
      {...screenContainerOtherProps}
    >
      <UPPScreenContentWrapper>
        <UPPHeader userId={userId} selectedTab="gnoDemo" />
        <GnoDemo daoId={userId} />
      </UPPScreenContentWrapper>
    </ScreenContainer>
  );
};

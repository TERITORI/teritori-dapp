import React, { FC } from "react";

import { UPPHeader } from "./components/UPPHeader";
import { UPPScreenContentWrapper } from "./components/UPPScreenContentWrapper";
import { Quests } from "../../components/Quests";
import {
  ScreenContainer,
  ScreenContainerProps,
} from "../../components/ScreenContainer";

export const QuestsUPPScreen: FC<{
  userId: string;
  screenContainerOtherProps: Partial<ScreenContainerProps>;
}> = ({ userId, screenContainerOtherProps }) => {
  return (
    <ScreenContainer
      key={`QuestsUPP ${userId}`} // this key is to reset the screen state when the id changes
      {...screenContainerOtherProps}
    >
      <UPPScreenContentWrapper>
        <UPPHeader userId={userId} selectedTab="quests" />
        <Quests userId={userId} />
      </UPPScreenContentWrapper>
    </ScreenContainer>
  );
};

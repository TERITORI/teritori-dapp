import React from "react";

import { BrandText } from "../../../components/BrandText";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { MiniScreenFC } from "../../../components/navigation/MiniNavigator";

export const MiniFeedScreen: MiniScreenFC<"MiniFeeds"> = ({}) => {
  return (
    <ScreenContainer
      headerChildren={<></>}
      responsive
      fullWidth
      footerChildren={null}
      noScroll
      mobileTitle="Feeds"
    >
      <BrandText>Welcome To Feeds</BrandText>
    </ScreenContainer>
  );
};

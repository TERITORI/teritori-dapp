import React from "react";

import { BrandText } from "../../../components/BrandText";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { MiniTabScreenFC } from "../../../components/navigation/MiniNavigator";

export const MiniFeedScreen: MiniTabScreenFC<"MiniFeeds"> = ({}) => {
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

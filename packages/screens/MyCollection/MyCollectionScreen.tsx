import React from "react";

import { HubIntro } from "../../components/HubIntro";
import { ScreenContainer } from "../../components/ScreenContainer";

export const MyCollectionScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <HubIntro hubPage="MyCollection" />
    </ScreenContainer>
  );
};

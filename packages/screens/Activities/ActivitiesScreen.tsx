import React from "react";

import { HubIntro } from "../../components/hub/HubIntro";
import { ScreenContainer } from "../../components/ScreenContainer";

export const ActivitiesScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <HubIntro hubPage="Activities" />
    </ScreenContainer>
  );
};

import React from "react";

import { ScreenContainer } from "../../components/ScreenContainer";
import { HubIntro } from "../../components/hub/HubIntro";

export const ActivitiesScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <HubIntro hubPage="Activities" />
    </ScreenContainer>
  );
};

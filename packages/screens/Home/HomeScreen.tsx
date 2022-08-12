import React from "react";

import { ScreenContainer } from "../../components/ScreenContainer";
import { HubIntro } from "../../components/hub/HubIntro";
import { HubLanding } from "../../components/hub/HubLanding";

export const HomeScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <HubIntro hubPage="Home" />
      <HubLanding />
    </ScreenContainer>
  );
};

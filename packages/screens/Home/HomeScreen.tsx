import React from "react";

import { HubIntro } from "../../components/hub/HubIntro";
import { HubLanding } from "../../components/hub/HubLanding";
import { ScreenContainer } from "../../components/ScreenContainer";

export const HomeScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <HubIntro hubPage="Home" />
      <HubLanding />
    </ScreenContainer>
  );
};

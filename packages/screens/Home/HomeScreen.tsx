import React from "react";

import { HubIntro } from "../../components/HubIntro";
import { HubLanding } from "../../components/HubLanding";
import { ScreenContainer } from "../../components/ScreenContainer";

export const HomeScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <HubIntro hubPage="Home" />
      <HubLanding />
    </ScreenContainer>
  );
};

import React from "react";

import { HomeLanding } from "../../components/HomeLanding";
import { HubIntro } from "../../components/HubIntro";
import { ScreenContainer } from "../../components/ScreenContainer";

export const HomeScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <HubIntro hubPage="Home" />
      <HomeLanding />
    </ScreenContainer>
  );
};

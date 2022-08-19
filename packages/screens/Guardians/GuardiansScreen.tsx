import React from "react";

import { ScreenContainer } from "../../components/ScreenContainer";
import { HubIntro } from "../../components/hub/HubIntro";

export const GuardiansScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <HubIntro hubPage="Guardians" />
    </ScreenContainer>
  );
};

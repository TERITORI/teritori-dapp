import React from "react";

import { HubIntro } from "../../components/HubIntro";
import { ScreenContainer } from "../../components/ScreenContainer";

export const GuardiansScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <HubIntro hubPage="Guardians" />
    </ScreenContainer>
  );
};

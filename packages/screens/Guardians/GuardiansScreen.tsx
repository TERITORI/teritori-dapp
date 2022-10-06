import React from "react";

import { ScreenContainer } from "../../components/ScreenContainer";
import { HubIntro } from "../../components/hub/HubIntro";
import { ScreenFC } from "../../utils/navigation";

export const GuardiansScreen: ScreenFC<"Guardians"> = () => {
  return (
    <ScreenContainer>
      <HubIntro />
    </ScreenContainer>
  );
};

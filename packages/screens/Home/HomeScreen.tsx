import React from "react";

import { ScreenContainer } from "../../components/ScreenContainer";
import { HubIntro } from "../../components/hub/HubIntro";
import { HubLanding } from "../../components/hub/HubLanding";
import { ScreenFC } from "../../utils/navigation";

export const HomeScreen: ScreenFC<"Home"> = () => {
  return (
    <ScreenContainer>
      <HubIntro />
      <HubLanding />
    </ScreenContainer>
  );
};

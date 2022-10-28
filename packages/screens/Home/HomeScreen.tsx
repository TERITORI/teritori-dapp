import React from "react";

import { ScreenContainer } from "../../components/ScreenContainer";
import { Footer } from "../../components/footers/Footer";
import { HubIntro } from "../../components/hub/HubIntro";
import { HubLanding } from "../../components/hub/HubLanding";
import { ScreenFC } from "../../utils/navigation";

export const HomeScreen: ScreenFC<"Home"> = () => {
  return (
    <ScreenContainer footerChildren={<Footer />}>
      <HubIntro />
      <HubLanding />
    </ScreenContainer>
  );
};

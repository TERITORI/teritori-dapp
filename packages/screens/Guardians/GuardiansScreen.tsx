import React from "react";

import { ScreenContainer } from "../../components/ScreenContainer";
import { Footer } from "../../components/footers/Footer";
import { HubIntro } from "../../components/hub/HubIntro";
import { ScreenFC } from "../../utils/navigation";

export const GuardiansScreen: ScreenFC<"Guardians"> = () => {
  return (
    <ScreenContainer footerChildren={<Footer />}>
      <HubIntro />
    </ScreenContainer>
  );
};

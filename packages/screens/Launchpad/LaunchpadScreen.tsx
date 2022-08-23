import React from "react";

import { ComingSoon } from "../../components/ComingSoon";
import { SocialNetworks } from "../../components/Footer";
import { ScreenContainer } from "../../components/ScreenContainer";

export const LaunchpadScreen: React.FC = () => {
  return (
    <ScreenContainer footerChildren={<SocialNetworks />} hideSidebar>
      <ComingSoon />
    </ScreenContainer>
  );
};

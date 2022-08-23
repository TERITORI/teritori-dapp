import React from "react";

import { ComingSoon } from "../../components/ComingSoon";
import { ScreenContainer } from "../../components/ScreenContainer";
import {SocialNetworks} from "../../components/Footer"

export const LaunchpadScreen: React.FC = () => {
  return (
    <ScreenContainer footerChildren={<SocialNetworks/>} hideSidebar>
      <ComingSoon />
    </ScreenContainer>
  );
};

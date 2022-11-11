import React from "react";

import { ScreenContainer } from "../../../components/ScreenContainer";
import { LogoDesignHeader } from "../../../components/freelanceServices/LogoDesign/Header";
import { ListServices } from "../../../components/freelanceServices/LogoDesign/ListServices";
import { LogoDesignMenu } from "../../../components/freelanceServices/LogoDesign/LogoDesignMenu";

export const LogoDesignScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <LogoDesignHeader />
      <LogoDesignMenu />
      <ListServices />
    </ScreenContainer>
  );
};

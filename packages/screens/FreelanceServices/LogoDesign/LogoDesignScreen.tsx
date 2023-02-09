import React from "react";

import { LogoDesignHeader } from "../../../components/freelanceServices/LogoDesign/Header";
import { ListServices } from "../../../components/freelanceServices/LogoDesign/ListServices";
import { LogoDesignMenu } from "../../../components/freelanceServices/LogoDesign/LogoDesignMenu";
import { ScreenFC } from "../../../utils/navigation";
import { FreelanceServicesScreenWrapper } from "../FreelanceServicesScreenWrapper";

export const LogoDesignScreen: ScreenFC<"LogoDesign"> = () => {
  return (
    <FreelanceServicesScreenWrapper>
      <LogoDesignHeader />
      <LogoDesignMenu />
      <ListServices />
    </FreelanceServicesScreenWrapper>
  );
};

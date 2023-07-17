import React from "react";

import { LogoDesignHeader } from "../../../../components/freelanceServices/LogoDesign/Header";
import { ListServices } from "../../../../components/freelanceServices/LogoDesign/ListServices";
import { LogoDesignMenu } from "../../../../components/freelanceServices/LogoDesign/LogoDesignMenu";

export const LogoDesign = () => {
  return (
    <>
      <LogoDesignHeader />
      <LogoDesignMenu />
      <ListServices />
    </>
  );
};

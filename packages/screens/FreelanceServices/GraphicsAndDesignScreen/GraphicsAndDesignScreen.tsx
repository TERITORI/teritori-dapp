import React from "react";

import { ScreenContainer } from "../../../components/ScreenContainer";
import { GraphicsAndDesignHeader } from "../../../components/freelanceServices/GraphicsAndDesign/Header";
import { PopularDesignExplorer } from "../../../components/freelanceServices/GraphicsAndDesign/PopularDesignExplorer";
import { ProfessionalServices } from "../../../components/freelanceServices/GraphicsAndDesign/ProfessionalServices";

export const GraphicsAndDesignScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <GraphicsAndDesignHeader />
      <PopularDesignExplorer />
      <ProfessionalServices />
    </ScreenContainer>
  );
};
